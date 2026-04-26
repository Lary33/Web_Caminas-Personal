class GestorNoticias {
    constructor() {
        this.contenedorNoticias = document.querySelector('.noticias');
        
        this.botonDestacar = document.createElement('button');
        this.botonDestacar.textContent = "Destacar Noticias Importantes";
        this.botonDestacar.classList.add('btn-destacar');
        
        const tituloPrincipal = this.contenedorNoticias.querySelector('h1');
        tituloPrincipal.after(this.botonDestacar);

        this.botonDestacar.addEventListener('click', () => this.destacarImportantes());

        this.articulosDOM = [];
    }

    async cargarNoticias() {
        try {
            const respuesta = await fetch('noticias.json');
            
            if (!respuesta.ok) {
                throw new Error(`Error de red: ${respuesta.status}`);
            }
            
            const noticias = await respuesta.json();
            this.renderizarNoticias(noticias);
            
        } catch (error) {
            console.error("Hubo un problema con la petición Fetch:", error);
            const mensajeError = document.createElement('p');
            mensajeError.textContent = "Error al cargar las noticias del servidor.";
            this.contenedorNoticias.appendChild(mensajeError);
        }
    }

    renderizarNoticias(noticias) {
        const noticiasEstaticas = this.contenedorNoticias.querySelectorAll('article');
        noticiasEstaticas.forEach(articulo => articulo.remove());

        noticias.forEach(noticia => {
            const article = document.createElement('article');
            const header = document.createElement('header');
            const p = document.createElement('p');
            const footer = document.createElement('footer');

            header.innerHTML = `
                <h2>${noticia.titulo}</h2>
                <h4>${noticia.fecha}</h4>
            `;
            
            p.textContent = noticia.contenido;
            
            footer.innerHTML = `
                <p>Categoría: <strong>${noticia.categoria}</strong></p>
            `;

            article.appendChild(header);
            article.appendChild(p);
            article.appendChild(footer);

            this.contenedorNoticias.appendChild(article);

            this.articulosDOM.push({
                elemento: article,
                importante: noticia.importante
            });
        });
    }

    destacarImportantes() {
        this.articulosDOM.forEach(item => {
            if (item.importante === true) {
                item.elemento.classList.toggle('noticia-destacada');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const appNoticias = new GestorNoticias();
    appNoticias.cargarNoticias();
});