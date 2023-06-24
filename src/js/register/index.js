import '../../css/style.css'

import RegisterForm from './form'

if (window.location.pathname == '/register') {
    const form = new RegisterForm();

    form.validateInput()
    form.validateBlur()
    form.resetFocus()
    form.validateSubmit()
}