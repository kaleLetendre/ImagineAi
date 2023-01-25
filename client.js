const paymentMethods = [
    {
      supportedMethods: ['basic-card']
    }
  ]
  
  const paymentDetails = {
    total: {
      label: 'Total Amount',
      amount: {
        currency: 'USD',
        value: 0.05 //token cost
      }
    }
  }
const paymentRequest = new PaymentRequest(paymentMethods, paymentDetails)
const processPaymentWithServer = paymentResponse => {
  return new Promise((resolve, reject) => {
    // Extract the payment token from the payment response
    const paymentToken = paymentResponse.details.cardNumber;
    // Extract the total amount of the payment
    const amount = paymentResponse.details.total.amount.value;
    
    fetch('/process-payment', {
      method: 'POST',
      body: JSON.stringify({ paymentToken, amount }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'succeeded') {
        resolve({ status: true });
      } else {
        reject({ status: false });
      }
    })
    .catch(error => reject({ status: false }));
  });
}
function showPaymentRequest() {
  if (window.PaymentRequest) {//Check that browser is upto date with payment API
    paymentRequest.show().then(paymentResponse => {
        processPaymentWithServer(paymentResponse).then(data => {//wait for payment to accept or decline from server side
            if (data.status) {
              paymentResponse.complete('success')
              //add tokens or whatever   
            } else {
                paymentResponse.complete('fail')
                //omg ur poor, no token for u
            }
        }).catch(error => {
            console.error('Error2:', error);
        });
    }).catch(err => {
      console.log('Error1:', err) //DOMException: Failed to execute 'show' on 'PaymentRequest': PaymentRequest.show() requires either transient user activation or delegated payment request capability
    })
  }else {
    console.log("error old browser, not supported")
  }
}
            
    window.onload = function() {
        document.getElementById('load').style.visibility = "hidden"
        const form = document.getElementById('dalle-form');
        const imageContainer = document.getElementById('image-container');
        // Retrieve the API key from the server
        fetch('/api-key')
            .then(response => response.json())
            .then(data => {
                const apiKey = data.apiKey;
                // Add a submit event listener to the form
                form.addEventListener('submit', event => {
                    event.preventDefault();
                    
                                document.getElementById('load').style.visibility = "visible"
                                const prompt = document.getElementById('prompt').value;
                                const numImages = 1;
                                // Use the API key to make a request to the OpenAI API
                                fetch('https://api.openai.com/v1/images/generations', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${apiKey}`
                                    },
                                    body: JSON.stringify({
                                        prompt: prompt,
                                        num_images: numImages
                                    })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    // Clear the image container before adding new images
                                    imageContainer.innerHTML = '';
                                    for(let i =0;i<numImages;i++){
                                        console.log(data.data[i].url)
                                        const img = document.createElement('img');
                                        img.src = data.data[i].url;
                                        imageContainer.appendChild(img);
                                        document.getElementById('load').style.visibility = "hidden"
                                    } 
                                })
                                .catch(error => {
                                    paymentRequest.abort().then(() => {
                                    // aborted payment request
                                    console.log('Payment request aborted due to no activity.')
                                    })
                                    .catch(err => {
                                    // error while aborting
                                    console.log('abort() Error: ', err)
                                    })
                                    console.error('Error:', error);
                                });
                        })
                    })
                    
    }

