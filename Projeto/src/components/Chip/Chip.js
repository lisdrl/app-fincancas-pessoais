import './style.css';
import { useState, useEffect } from 'react';

export function Chip({ setFiltro, filtro, item }) {
    const [chipAtivo, setChipAtivo] = useState(false);



    return (
        <button
            className={`container-chip ${chipAtivo && "chip-selected"}`}
            onClick={() => {
                setFiltro(prevState => {
                    const array = [...prevState];
                    const index = array.findIndex(x => x === item);
                    if (index !== -1){
                        array.splice(index, 1);
                        return array;
                    } else {
                        const arrayModificado = [...array, item];
                        return arrayModificado;
                    };
                });
                setChipAtivo(!chipAtivo ? true : false);
            }
            }
            key={item}>
            <span className="chip-span">{item}</span>
            <img className={chipAtivo ? 'x-icon' : 'plus-icon'} src={chipAtivo ? './assets/x-icon.svg' : './assets/plus-icon.svg'} />
        </button>
    )
}


// export function Chip({ setFiltro, item }) {
//     const [chipAtivo, setChipAtivo] = useState(false);

//     return (
//         <button
//             className={`container-chip ${chipAtivo && "chip-selected"}`}
//             onClick={() => {
//                 setFiltro(prevState => {
//                     const array = [...prevState];
//                     const index = array.findIndex(x => x === item);
//                     if (index !== -1){
//                         array.splice(index, 1);
//                         // setChipAtivo(false);
//                         return array;
//                     } else {
//                         const arrayModificado = [...array, item];
//                         return arrayModificado;
//                     };
//                 });
//                 setChipAtivo(chipAtivo ? false : true);
//             }
//             }
//             key={item}>
//             <span className="chip-span">{item}</span>
//             <img className={chipAtivo ? 'x-icon' : 'plus-icon'} src={chipAtivo ? './assets/x-icon.svg' : './assets/plus-icon.svg'} />
//         </button>
//     )
// }