import InputMask from 'react-input-mask';
import './style.css';

export function Modal ({h1, handleCloseModal, handleSubmit, tipoSaida, setTipoSaida, formulario, handleChange}) {
    return (
        <div className="position-center">
              <div className="intermediate">
                <div className="modal-container">
                  <h1>
                    {h1}
                    <img
                      className="close-icon"
                      onClick={handleCloseModal}
                      src="./assets/close.svg"
                    />
                  </h1>
                  <div className="entrada-saida">
                    <span
                      className={`${tipoSaida ? "greyish" : "colored-entrada"}`}
                      id="credit-button"
                      onClick={() => setTipoSaida(false)}
                    >
                      Entrada
                    </span>
                    <span
                      className={`${tipoSaida ? "colored-saida" : "greyish"}`}
                      id="debit-button"
                      onClick={() => setTipoSaida(true)}
                    >
                      Saída
                    </span>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="input-container flex-column">
                      <label>Valor</label>
                      <input
                        className="modal-input"
                        name="valor" 
                        value={formulario.valor} 
                        type="number" 
                        step="0.01" 
                        min="0.01" 
                        onChange={handleChange} 
                        required
                      ></input>
                    </div>
                    <div className="input-container flex-column">
                      <label>Categoria</label>
                      <input
                        className="modal-input" 
                        name="categoria" 
                        value={formulario.categoria} 
                        type="text" 
                        onChange={handleChange} 
                        required
                      ></input>
                    </div>
                    <div className="input-container flex-column">
                      <label>Data</label>
                      <InputMask
                        mask="99/99/9999"
                        className="modal-input" 
                        name="data" 
                        value={formulario.data} 
                        onChange={handleChange} 
                        required
                      />
                    </div>
                    <div className="input-container flex-column">
                      <label>Descrição</label>
                      <input
                        className="modal-input" 
                        name="descricao" 
                        value={formulario.descricao} 
                        type="text" 
                        onChange={handleChange} 
                        required
                      ></input>
                    </div>
                    <button className="btn-insert" type="submit">Confirmar</button>
                  </form>
                </div>
              </div>
            </div>
    )
};