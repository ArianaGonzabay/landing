/*FUNCIONES FLECHA*/
let ready = () => {
    console.log('DOM está listo')
    /*debugger*/
}

let loaded = (eventLoaded) =>{
    /*debugger*/
    let myform = document.getElementById('form');
    /*debugger;*/
    myform.addEventListener('submit', (eventSubmit)=>{
        eventSubmit.preventDefault();
        /*debugger;*/
        const emailElement = document.querySelector('.form-control-lg');
        const emailText = emailElement.value;

        if(emailText.length === 0){
            emailElement.focus()


            /*Animate API*/
            emailElement.animate(
                /*lista de los keyframes*/
                [
                    {transform: "translateX(0)"},
                    {transform: "translateX(50px)"},
                    {transform: "translateX(-50px)"},
                    {transform: "translateX(0)"}
                ],
                {
                    duration: 400,
                    easing: "linear",
                }
            )
        }

        
    })
    console.log('Iframes e Images cargadas')

}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded)
