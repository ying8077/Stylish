const APP_ID = 125964;
const APP_KEY = 'app_pXwRaAixl344j3LDgX9moNo4pF0zzbkmsbQQbPgiurjG46muyuxo4xO86WxC';
const submitButton = document.querySelector('#submit-button');
const totalAmount = document.querySelector('#total-amount');
const receiverName = document.querySelector('#receiver');
const phoneNum = document.querySelector('#phonenum');
const address = document.querySelector('#address');
const email = document.querySelector('#email');

function findSelection(field) {
    const element = document.getElementsByName(field);
    for (i = 0; i < element.length; i++) {
        if (element[i].checked) {
            return element[i].value;
        }
    }
}

let fields = {
    number: {
        element: document.getElementById('card-number'),
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: document.getElementById('card-ccv'),
        placeholder: '後三碼'
    }
}

TPDirect.setupSDK(APP_ID, APP_KEY, 'sandbox');
TPDirect.card.setup({
    fields: fields,
    styles: {
        'input': {
            'color': '#D3D3D3',
            'font-size': '16px',
            'line-height': '32px'
        },
        ':focus': {
            'color': 'black'
        },
        '.valid': {
            'color': 'green'
        },
        '.invalid': {
            'color': 'red'
        }
    },
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 6,
        endIndex: 11
    }
})

TPDirect.card.onUpdate(update => {
    update.canGetPrime ? submitButton.removeAttribute('disabled') : submitButton.setAttribute('disabled', 'true');
})

function onSubmit(event) {
    event.preventDefault();
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime');
        return
    }

    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            alert(`get prime error ${result.msg}`);
            return
        }
        alert(`get prime成功!prime: ${result.card.prime}`);

        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "prime": result.card.prime,
                "details": "TapPay Test",
                "amount": totalAmount.textContent,
                "phone_number": phoneNum.value,
                "name": receiverName.value,
                "email": email.value,
                "address": address.value,
                "deliver_time": findSelection("deliver")
            })
        }
        fetch('/orders/pay-by-prime', config)
            .then(res => res.json())
            .then(data => alert(data.message))
    })

}