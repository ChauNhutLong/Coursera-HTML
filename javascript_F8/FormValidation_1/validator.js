
// Đối tượng Validator
function Validator(options) {

    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorMessage;
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

        // Lấy ra các rule của selector
        var rules = selectorRules[rule.selector];

        // Lặp qua từng rule và kiểm tra
        // Nếu có lỗi thì dừng việc kiểm tra
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add("invalid");
        }
        else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove("invalid");
        }

        return !errorMessage;
    }

    var formElement = document.querySelector(options.form);

    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();
            
            var isFormValid = true;


            // Lặp qua từng rules và validate
            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                // Trường hợp submit với JavaScript
                if (typeof options.onSubmit === "function") {
                    
                    var enableInputs = formElement.querySelectorAll("[name]:not([disabled]") ;

                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        return (values[input.name] = input.value) && values;
                    }, {})
                    
                    options.onSubmit(formValues);        
                } 
                // Trường hợp submit với hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }



        // Lặp qua mỗi rule và xử lý 
        options.rules.forEach((rule) => {

            // Lưu lại các rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElement = formElement.querySelector(rule.selector);
            
            if (inputElement) {
                // Xử lý trường hợp blur khỏi input
                inputElement.onblur = () => {
                   validate(inputElement, rule);
                }

                // Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = () => {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove("invalid");
                }
            }
        })
    }
}

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : message || "Vui lòng nhập trường này";
        }
    }

}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : "Trường này phải là email";
        }
    }
}

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: (value) => {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: (value) => {
            return value === getConfirmValue() ? undefined : message || "Giá trị nhập vào không chính xác";
        }
    }
}

