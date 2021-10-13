import './style.css';
import { useState } from 'react';

export function Registro({ id, category, date, description, value, type, week_day, registro, excluirRegistro, editarRegistro, setDeletar, deletar }) {
  const [idDeletado, setIdDeletado] = useState();

  return (
    <div>
      <tr key={id} className="table-line">
        <td className="line-items">
          {new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
        </td>
        <td className="line-items week-day-item">{week_day}</td>
        <td className="line-items" id="description">{description}</td>
        <td className="line-items">{category}</td>
        <td className={`line-items value ${type === "debit" ? "debit-color" : "credit-color"}`}>
          {`${(value / 100).toLocaleString("pt-BR", {
            style: 'currency',
            currency: 'BRL'
          })}`}
        </td>
        <td className="line-items">
          <img
            className="edit-icon"
            onClick={() => { editarRegistro(registro) }}
            src="./assets/editar.svg" />
          <img
            className="delete-icon"
            onClick={() => setIdDeletado(id)}
            src="./assets/excluir.svg" />
        </td>
      </tr>
      <hr width="100%"></hr>
      {id === idDeletado &&
        (<div className={`container-confirm-delete`}>
          <div className="container-confirm-delete__triangle"></div>
          <div className="container-confirm-delete__baloon">
            <h1>Apagar item?</h1>
            <div className="btn-actions-confirm-delete">
              <button className="btn-actions-confirm" onClick={() => { excluirRegistro(id) }}>Sim</button>
              <button className="btn-actions-delete" onClick={() => setIdDeletado()} >Não</button>
            </div>
          </div>
        </div>)
      }
    </div>

  )
};