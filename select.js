export default class Select {
    constructor(element){
        this.element = element;
        this.options = getFormattedOptions(element.querySelectorAll('option'));
        this.customElemet = document.createElement('div');
        this.labelElement = document.createElement('span');
        this.optionsCustomElement = document.createElement('ul');
        setupCustomElement(this);
        // element.style.display = 'none';
        element.after(this.customElemet);
    }

    get selectedOption() {
        return this.options.find(option => option.selected);
    }

    get selectedOptionIndex() {
        return this.options.indexOf(this.selectedOption)
    }

    selectValue(value) {
        const newSelectedOption = this.options.find(option => {
            return option.value === value;
        })
        const prevSelectedOption = this.selectedOption;
        prevSelectedOption.selected = false;
        prevSelectedOption.element.selected = false;

        newSelectedOption.selected = true;
        newSelectedOption.element.selected = true;

        this.labelElement.innerText = newSelectedOption.label;
        this.optionsCustomElement
            .querySelector(`[data-value='${prevSelectedOption.value}']`)
            .classList.remove('selected');
        const newCustomElement = this.optionsCustomElement
            .querySelector(`[data-value='${newSelectedOption.value}']`);
        
        newCustomElement.classList.add('selected');
        newCustomElement.scrollIntoView({ block: 'nearest'});
    }
}

function setupCustomElement(select) { 
    select.customElemet.classList.add('custom-select-container');
    select.customElemet.tabIndex = 0;
    
    select.labelElement.classList.add('custom-select-value');
    select.labelElement.innerText = select.selectedOption.label;
    select.customElemet.append(select.labelElement);

    select.optionsCustomElement.classList.add('custom-select-options');
    select.options.forEach(option => {
        const optionElement = document.createElement('li');
        optionElement.classList.add('custom-select-option');
        optionElement.classList.toggle('selected', option.selected);
        optionElement.innerText = option.label;
        optionElement.dataset.value = option.value;
        optionElement.addEventListener('click', () => {
            select.selectValue(option.value);
            select.optionsCustomElement.classList.remove('show');
        });
        select.optionsCustomElement.append(optionElement);
    });
    select.customElemet.append(select.optionsCustomElement);

    select.labelElement.addEventListener('click', () => { 
        select.optionsCustomElement.classList.toggle('show');
    });

    select.customElemet.addEventListener('blur', () => { 
        select.optionsCustomElement.classList.remove('show');
    });

    let debounceTimeout;
    let serachTerm = '';
    select.customElemet.addEventListener('keydown', e => {
        switch (e.code) {
            case 'Space':
                select.optionsCustomElement.classList.toggle('show');
                break;
            case 'ArrowUp': {
                e.preventDefault()
                const prevOption = select.options[select.selectedOptionIndex - 1];
                if(prevOption) {
                    select.selectValue(prevOption.value);
                }
                break;
            }
            case 'ArrowDown': {
                e.preventDefault()
                const nextOption = select.options[select.selectedOptionIndex + 1];
                if(nextOption) {
                    select.selectValue(nextOption.value); 
                }
                break;
            }
            case 'Enter':
            case 'Escape':
                select.optionsCustomElement.classList.remove('show');
                break;
            default : {
                clearTimeout(debounceTimeout);
                if (select.selectedOption.label.toLowerCase().charAt(0)  == e.key.toLowerCase() ) {
                    serachTerm = e.key
                    const nextOption = select.options[select.selectedOptionIndex + 1];
                    if(nextOption?.label.toLowerCase().startsWith(serachTerm)) {
                        select.selectValue(nextOption.value); 
                        break;
                    } else if (nextOption?.label.toLowerCase().startsWith(serachTerm) == false) {
                        const startOption = select.options.find(option => {
                            return option.label.toLowerCase().startsWith(serachTerm);
                        });
                        if(startOption) {
                            select.selectValue(startOption.value);
                            break
                        }
                    }
                } else {
                    serachTerm += e.key;
                    console.log(serachTerm)

                    const searchOption = select.options.find(option => {
                        return option.label.toLowerCase().startsWith(serachTerm);
                    });
                    if(searchOption) {
                        select.selectValue(searchOption.value);
                    }
                }
                debounceTimeout = setTimeout(() => {
                    serachTerm = '';
                }, 500);
                
            }
        }
    });

}

function getFormattedOptions(optionElements) {
    return [...optionElements].map(optionElement => {
        return {
            value: optionElement.value,
            label: optionElement.label,
            selected: optionElement.selected,
            element: optionElement
        }
    });
}