import emailjs from '../node_modules/@emailjs/browser/es/index.js';

function renderFadedBackground() {
    const fadedBackground = document.createElement('div');
    const sliderWidth = window.innerWidth - document.body.clientWidth;
    fadedBackground.id = 'fadedBackground';
    fadedBackground.classList.add('fadedBackground');
    document.body.appendChild(fadedBackground);
    document.body.style.paddingRight = `${sliderWidth}px`;
    document.body.style.overflowY = 'hidden';
};

function renderForm() {
    const formBody = document.createElement('div');
    const contactsColumn = document.createElement('div');
    const messageColumn = document.createElement('div');
    const textArea = document.createElement('textarea');
    const textAreaLabel = document.createElement('label');
    const submit = document.createElement('input');
    const closeIcon = document.createElement('img');

    formBody.name = 'contact'
    formBody.id = 'formBody';
    formBody.classList.add('formBody');

    contactsColumn.id = 'leftColumn';
    contactsColumn.classList.add('leftColumn');

    messageColumn.id = 'rightColumn';
    // FIXME: Classes in BEM style, ids in upperCase style
    messageColumn.classList.add('rightColumn');

    textArea.id = 'message';
    textArea.classList.add('contactUs__message');
    textArea.name = 'message';
    textArea.placeholder = 'You question here ...';
    textArea.spellcheck = 'true';

    textAreaLabel.classList.add('contactUs__label', 'contactUs__label_brown');
    textAreaLabel.for = 'message';
    textAreaLabel.innerHTML = 'Message';

    submit.id = 'submitForm';
    submit.name = 'contact';
    submit.type = 'submit';
    submit.value = 'Send';
    submit.classList.add('contact-us__button');
    submit.style.width = '100px'

    messageColumn.appendChild(textAreaLabel);
    messageColumn.appendChild(textArea);
    messageColumn.appendChild(submit);

    formBody.appendChild(contactsColumn);
    formBody.appendChild(messageColumn);

    createInput('name', 'userName', 'text', 'Please enter your name', true, contactsColumn);
    createInput('phone', 'userPhone', 'tel', 'Enter you tel. number', false, contactsColumn);
    createInput('e-mail', 'userMail', 'email', 'Enter your e-mail', true, contactsColumn);

    closeIcon.id = 'closeContact';
    closeIcon.classList.add('closeIcon', 'closeIcon_for-contact')
    closeIcon.src ='../images/cross-symbol.svg'

    document.querySelector('#fadedBackground').appendChild(formBody);
    formBody.appendChild(closeIcon);
};

function createInput(id, name, type, placeholder, required = false, target) {
    const input = document.createElement('input');
    const label = document.createElement('label');
    const wrapper = document.createElement('div');
    const status = document.createElement('div');
    const container = document.createElement('div');


    wrapper.classList.add('inputWrapper');
    status.classList.add('inputStatus'); 
    container.classList.add('inputContainer');

    label.for = id;
    label.innerHTML = id;
    label.classList.add('contactUs__label');

    input.id = id;
    input.classList.add('contactUs__input');
    input.name = name;
    input.type = type;
    input.placeholder = placeholder;

    if (required) {
        input.required = 'required';
    }

    container.appendChild(label);
    container.appendChild(input);

    wrapper.appendChild(status);
    wrapper.appendChild(container);

    target.appendChild(wrapper);

    return input;
};

function closeContactForm() {
    document.querySelector('#fadedBackground').remove();
    document.body.style.paddingRight = `0px`;
    document.body.style.overflowY = 'scroll';
}

function sendMessage() {
        
    const parameters = {
        userName: document.querySelector('#name').value,
        userPhone: document.querySelector('#phone').value,
        userMail: document.querySelector('#e-mail').value,
        message: document.querySelector('#message').value,
    };

    emailjs
    .send('service_uku97rm', 'template_8ozy3qw', parameters, 'a7NGt-DkApMsXSPkE')
    .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        alert("here");
     }, function(error) {
        console.log('FAILED...', error);
        alert("here2");
     });
}

function openContactForm() {
    renderFadedBackground();
    renderForm();

    const nameField = document.querySelector('#name');
    const emailField = document.querySelector('#e-mail');

    document.querySelector('#closeContact').addEventListener('click', closeContactForm);
    document.querySelector('#fadedBackground').addEventListener('click', (e) => {
        if (e.target === document.querySelector('#fadedBackground')) {
            closeContactForm();
        }
    });
    document.querySelector('#submitForm').addEventListener('click',() => {

        function checkRequiredInputFor(element) {
            if (nameField.value === '') {
                const warning = document.createElement('img');
                warning.src = './images/warning.png';
                Array.from(document.querySelectorAll('.inputWrapper')).forEach((cont) => {
                    if(Array.from(cont.childNodes[1].childNodes).includes(element)) {
                       cont.classList.add('required');
                       cont.childNodes[0].appendChild(warning);
                    }
                });

            }
        }

        checkRequiredInputFor(nameField);
        checkRequiredInputFor(emailField);

        if ((nameField.value !== '') && (emailField.value !== '')) {
            sendMessage();
        }
    });

    console.log(document.querySelector('#name').value === '');
}

export {openContactForm};