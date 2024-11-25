const databaseURL = 'https://landing-b5875-default-rtdb.firebaseio.com/coleccion.json';

let sendData = () => {  
    // Obtén los datos del formulario
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Añadir fecha de guardado
    data['saved'] = new Date().toLocaleString('es-CO', { timeZone: 'America/Guayaquil' });

    fetch(databaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
    })
    .then(result => {
        alert('¡Gracias por unirte a nuestra comunidad! Recibirás nuestras mejores ofertas y contenido exclusivo.');
        form.reset();
        getData();
    })
    .catch(error => {
        alert('Hemos experimentado un error. ¡Vuelve pronto!');
    });
}

let getData = async () => {  
    try {
        const response = await fetch(databaseURL, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const data = await response.json();

        if(data != null) {
            // Conteo de preferencias
            let preferenceStats = new Map();
            preferenceStats.set("Comida Ecuatoriana", 0);
            preferenceStats.set("Comida Italiana", 0);
            preferenceStats.set("Comida Saludable", 0);
            preferenceStats.set("Comida Asiática", 0);
            preferenceStats.set("Piqueos", 0);
            
            let totalSuscriptores = 0;

            // Contar suscriptores por preferencia
            if (Object.keys(data).length > 0) {
                for(let key in data) {
                    const { preferencias } = data[key];
                    if (preferencias) {
                        let count = preferenceStats.get(preferencias) || 0;
                        preferenceStats.set(preferencias, count + 1);
                        totalSuscriptores++;
                    }
                }
            }

            // Actualizar tabla de estadísticas
            if (totalSuscriptores > 0) {
                subscribers.innerHTML = '';
                
                for (let [preferencia, cantidad] of preferenceStats) {
                    const porcentaje = ((cantidad / totalSuscriptores) * 100).toFixed(1);
                    const rowTemplate = `
                    <tr>
                        <td>${preferencia}</td>
                        <td>
                            <div class="d-flex justify-content-between">
                                <span>${cantidad}</span>
                                <span class="text-muted">${porcentaje}%</span>
                            </div>
                        </td>
                    </tr>`;
                    subscribers.innerHTML += rowTemplate;
                }

                // Añadir fila de total
                const totalRow = `
                <tr class="table-info">
                    <td><strong>Total Suscriptores</strong></td>
                    <td><strong>${totalSuscriptores}</strong></td>
                </tr>`;
                subscribers.innerHTML += totalRow;
            }
        }

    } catch (error) {
        alert('Hemos experimentado un error al cargar las estadísticas.');
    }
}

let ready = () => {
    console.log('DOM está listo');
    getData();
}

let loaded = (eventLoaded) => {
    let myform = document.getElementById('form');
    
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault();
        
        // Validar todos los campos requeridos
        const nombre = document.querySelector('input[name="nombre"]');
        const email = document.querySelector('input[name="email"]');
        const preferencias = document.querySelector('select[name="preferencias"]');
        const terminos = document.querySelector('input[name="terminos"]');

        // Validación básica
        if (!nombre.value || !email.value || !preferencias.value || !terminos.checked) {
            const invalidField = [nombre, email, preferencias, terminos].find(field => {
                return field.type === 'checkbox' ? !field.checked : !field.value;
            });

            invalidField.animate(
                [
                    {transform: "translateX(0)"},
                    {transform: "translateX(50px)"},
                    {transform: "translateX(-50px)"},
                    {transform: "translateX(0)"}
                ],
                {
                    duration: 250,
                    easing: "linear",
                }
            );

            invalidField.focus();
            return;
        }

        sendData();
    });
}

window.addEventListener("DOMContentLoaded", ready);
window.addEventListener("load", loaded);