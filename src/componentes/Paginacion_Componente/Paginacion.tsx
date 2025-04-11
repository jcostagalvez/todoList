import React, {useEffect, useState } from 'react';
import '../../utils/css/paginacion.css';
interface PaginacionProps {
    totalPaginas: number[];
    arrayPaginas: number[];
    paginaActual: number;
    paginadoVisible: number;
    onPaginaChange: (pagina: number) => void;
}

export const Paginacion: React.FC<PaginacionProps> = ({ totalPaginas, arrayPaginas, paginadoVisible, paginaActual, onPaginaChange }) => {
    const arrayPaginasTotales: number[] = totalPaginas;
    const [paginas, setPaginas] = useState(arrayPaginas);
    useEffect(() => {
        if((paginaActual == 1 && paginas[0] == 1 && paginas.length != totalPaginas.length)
        || paginaActual == 1 && paginas[0] != 1 
        || paginas[paginas.length - 1] > totalPaginas[totalPaginas.length - 1]){
            setPaginas(totalPaginas.slice(0, paginadoVisible));
        }
    }, [totalPaginas]);
    const handlePaginaChange = (pagina: number) => {
        onPaginaChange(pagina);
        console.log('pagina actual', pagina);
        if((totalPaginas.length + 1) != paginadoVisible){
            let newPaginas: number[];
            if(pagina === 1) {
                console.log('primero y se le añade puntos suspensivos a un lado');
                newPaginas = arrayPaginasTotales.slice(pagina - 1, pagina + paginadoVisible - 1);  
            }else if(pagina === (totalPaginas.length + 1)) {
                console.log('tercero y se le añade puntos suspensivos a un lado izquierdo');
                newPaginas = paginas;
            }else{
                const pagMenor = pagina == 1 ? 1 : pagina - 2;
                const pagMayor = pagina ==  totalPaginas.length ? pagina : pagina + paginadoVisible - 2;
                if(pagMenor == 0 && pagMayor == (totalPaginas.length + 1)){
                    newPaginas = arrayPaginasTotales.slice(pagMenor, pagMayor);
                }else if(pagina == totalPaginas.length) {
                    newPaginas = arrayPaginasTotales.slice(pagMenor - 1, pagMayor);
                    console.log('Se añade al lado izquierdo');
                } else if(pagMenor == 0) {
                    newPaginas = arrayPaginasTotales.slice(pagMenor, pagMayor);
                    console.log('Se añade al lado derecho');
                }else{
                    newPaginas = arrayPaginasTotales.slice(pagMenor, pagMayor);
                    console.log('segundo y se le añade puntos suspensivos ambos lados');
                }
    
            }
            
            setPaginas(newPaginas)

        }

    }

    return(
        <>
            {/* Componete del array */}
            <div className='paginacion-container'>
            {paginas.map(pagina => (
                <button
                    key={pagina}
                    className={`paginacion-boton ${paginaActual === pagina ? 'active' : ''}`}
                    onClick={() => handlePaginaChange(pagina)}
                >
                    {pagina}
                </button>
            ))}

            </div>
        </>        
    )
};
