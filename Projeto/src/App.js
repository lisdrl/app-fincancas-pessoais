import './App.css';

import { Registro } from './components/Registro/Registro';
import { Modal } from './components/Modal/Modal';
import { Chip } from './components/Chip/Chip';
import { FilterInput } from './components/FilterInput/FilterInput';

import { listarRegistros } from './utils/listarRegistros';
import { handleOrdem } from './utils/handleOrdem';

import { useState, useEffect } from 'react';

function App() {

  // ------------------------------- ESTADOS --------------------------------

  // Tabela de Registros
  const [formulario, setFormulario] = useState({ valor: 0, categoria: '', data: '', descricao: '' });
  const [registros, setRegistros] = useState([]);
  const [deletar, setDeletar] = useState(false);
  const [ordemData, setOrdemData] = useState("crescente");
  const [ordemDia, setOrdemDia] = useState(false);
  const [ordemValor, setOrdemValor] = useState(false);
  // Filtros
  const [filtroVisivel, setFiltroVisivel] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [semana, setSemana] = useState(["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]);
  const [filtroDia, setFiltroDia] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState([]);
  const [filtroMinMax, setFiltroMinMax] = useState({ min: "", max: "" });
  // Modais
  const [adicionandoRegistro, setAdicionandoRegistro] = useState(false);
  const [editandoRegistro, setEditandoRegistro] = useState(false);
  const [tipoSaida, setTipoSaida] = useState(true);
  // Resumo
  const [entrada, setEntrada] = useState(0)
  const [saida, setSaida] = useState(0)
  const [saldo, setSaldo] = useState(0)
  // Outros

  
  // ------------------------------- FUNÇÕES --------------------------------

  // ------ TABELA DE REGISTROS ------

  useEffect(() => {
    listarRegistros().then((response) => {
      const arrayOrdenado = response.sort((a, b) => new Date(a.date) - new Date(b.date));
      setRegistros(arrayOrdenado);
    });
  }, []);

  async function excluirRegistro(id) {
    const deletado = await fetch(`http://localhost:3333/transactions/${id}`, {
      method: "DELETE",
    });
    listarRegistros().then((response) => {
      setRegistros(response);
    });
  };

  useEffect(() => {
    if (ordemValor === "crescente") {
      setRegistros(prevState => {
        const array = [...prevState];
        const arrayOrdenado = array.sort((a, b) => Number(a.value) - Number(b.value));
        return arrayOrdenado;
      })
    } else if (ordemValor === "decrescente") {
      setRegistros(prevState => {
        const array = [...prevState];
        const arrayOrdenado = array.sort((a, b) => Number(b.value) - Number(a.value));
        return arrayOrdenado;
      })
    }
  }, [ordemValor]);

  useEffect(() => {
    if (ordemData === "crescente") {
      setRegistros(prevState => {
        const array = [...prevState];
        const arrayOrdenado = array.sort((a, b) => new Date(a.date) - new Date(b.date));
        return arrayOrdenado;
      })
    } else if (ordemData === "decrescente") {
      setRegistros(prevState => {
        const array = [...prevState];
        const arrayOrdenado = array.sort((a, b) => new Date(b.date) - new Date(a.date));
        return arrayOrdenado;
      })
    }
  }, [ordemData]);

  useEffect(() => {
    if (ordemDia === "crescente") {
      setRegistros(prevState => {
        const array = [...prevState];
        const arrayOrdenado = array.sort((a, b) => (new Date(a.date)).getDay() - (new Date(b.date)).getDay());
        return arrayOrdenado;
      })
    } else if (ordemDia === "decrescente") {
      setRegistros(prevState => {
        const array = [...prevState];
        const arrayOrdenado = array.sort((a, b) => (new Date(b.date)).getDay() - (new Date(a.date)).getDay());
        return arrayOrdenado;
      })
    }
  }, [ordemDia]);


  // ------ RESUMO - ENTRADAS, SAÍDAS E SALDO ------

  useEffect(() => {
    const arrayDeRegistros = [...registros];
    let somaEntrada = 0, somaSaida = 0, valorSaldo = 0;

    for (let i = 0; i < arrayDeRegistros.length; i++) {
      if (arrayDeRegistros[i].type === "credit") {
        somaEntrada = somaEntrada + Number(arrayDeRegistros[i].value)
      } else if (arrayDeRegistros[i].type === "debit") {
        somaSaida = somaSaida + Number(arrayDeRegistros[i].value);
      };
    };

    valorSaldo = somaEntrada - somaSaida;

    setEntrada(somaEntrada);
    setSaida(somaSaida);
    setSaldo(valorSaldo);
  }, [[], registros])


  // ------ MODAIS - ADICIONAR E EDITAR REGISTRO ------

  function handleChange(event) {
    setFormulario({ ...formulario, [event.target.name]: event.target.value });
  };

  function handleCloseModal() {
    setTipoSaida(true);
    setAdicionandoRegistro(false);
    setEditandoRegistro(false);
    setFormulario({ valor: 0, categoria: '', data: '', descricao: '' });
  };

  function handleSubmitAdicionar(event) {
    event.preventDefault();

    const { valor, categoria, data, descricao } = formulario;

    const ano = Number(data.slice(6));
    const mes = Number(data.slice(3, 5)) - 1;
    const dia = Number(data.slice(0, 2));

    const index = new Date(ano, mes, dia).getDay();
    const diaDaSemana = semana[index];

    const form = {
      "date": new Date(ano, mes, dia),
      "week_day": diaDaSemana,
      "description": descricao,
      "value": valor * 100,
      "category": categoria,
      "type": tipoSaida ? "debit" : "credit"
    };

    fetch("http://localhost:3333/transactions", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(form)
    }).then(response => {
      const responseJSON = response.json().then(novoRegistro => {
        setRegistros(prevState => {
          const arrayDeRegistros = [...prevState, novoRegistro];
          const arrayOrdenado = arrayDeRegistros.sort((a, b) => new Date(a.date) - new Date(b.date));
          return arrayOrdenado;
        })
      })
    })

    setAdicionandoRegistro(false);
    setTipoSaida(true);
  };

  async function editarRegistro(registro) {
    if (registro.type === "credit") {
      setTipoSaida(false);
    } else if (registro.type === "debit") {
      setTipoSaida(true);
    };

    setEditandoRegistro(registro);

    setFormulario({
      valor: registro.value / 100,
      categoria: registro.category,
      diaDaSemana: registro.week_day,
      data: new Date(registro.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
      descricao: registro.description,
      id: registro.id
    });
  };

  function handleSubmitEditar(event) {
    event.preventDefault();
    const { valor, categoria, data, descricao, id } = formulario;
    const ano = Number(data.slice(6));
    const mes = Number(data.slice(3, 5)) - 1;
    const dia = Number(data.slice(0, 2));
    const index = new Date(ano, mes, dia).getDay();
    const diaDaSemana = semana[index];
    // 01/34/6789
    const body = {
      "date": new Date(ano, mes, dia),
      "week_day": diaDaSemana,
      "description": descricao,
      "value": valor * 100,
      "category": categoria,
      "type": tipoSaida ? "debit" : "credit"
    };

    fetch(`http://localhost:3333/transactions/${formulario.id}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "PUT",
      body: JSON.stringify(body)
    }).then(response => {
      const responseJSON = response.json().then(novoRegistro => {
        const array = [...registros];
        let index = array.findIndex(registro => registro.id === id);
        array.splice(index, 1, novoRegistro);
        const arrayOrdenado = array.sort((a, b) => new Date(a.date) - new Date(b.date));
        setRegistros(arrayOrdenado);
      })
    })
    setEditandoRegistro(false);
    setTipoSaida(true);
    setFormulario({ valor: 0, categoria: '', data: '', descricao: '' });
  };

  // ------ FILTROS ------

  useEffect(() => {
    const arrayDeCategorias = [];
    const arrayDeRegistros = [...registros];

    arrayDeRegistros.forEach(registro => {
      const categoriaEncontrada = arrayDeCategorias.some(categoria => categoria === registro.category);
      if (!categoriaEncontrada) {
        arrayDeCategorias.push(registro.category);
      };
    })

    arrayDeCategorias.forEach(categoria => {
      const categoriaEncontrada = arrayDeRegistros.some(registro => registro.category === categoria);
      if (!categoriaEncontrada) {
        const index = arrayDeCategorias.findIndex(item => item === categoria);
        arrayDeCategorias.splice(index, 1)
      };
    })

    setCategorias(arrayDeCategorias);
    setSemana(["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]);
  }, [registros]);

  async function handleClickFiltro() {
    if (!filtroVisivel) {
      setFiltroVisivel(true);
    } else {
      setFiltroVisivel(false);
      listarRegistros().then((response) => {
        setRegistros(response);
      })
    }
  }

  function handleChangeFiltro(event) {
    setFiltroMinMax({ ...filtroMinMax, [event.target.name]: event.target.value });
  };

  async function handleFiltroSubmit(event) {
    event.preventDefault();

    setRegistros(prevState => {
      const array = [...prevState];
      const arrayFiltrado = array
        .filter(registro => !filtroMinMax.max || Number(registro.value) >= (Number(filtroMinMax.min) * 100) && Number(registro.value) <= (Number(filtroMinMax.max) * 100))
        .filter(registro => !filtroDia.length || filtroDia.includes(registro.week_day))
        .filter(registro => !filtroCategoria.length || filtroCategoria.includes(registro.category))
      return arrayFiltrado;
    });

    setFiltroDia([]);
    setFiltroCategoria([]);
    setFiltroMinMax({ min: "", max: "" });
    setCategorias([]);
    setSemana([]);
  };

  async function limparFiltros() {
    setFiltroDia([]);
    setFiltroCategoria([]);
    setFiltroMinMax({ min: "", max: "" });
    setCategorias([]);
    setSemana([]);

    listarRegistros().then((response) => {
      setRegistros(response);
    });
  };



  // ------------------------------- COMPONENTE APP --------------------------------
  return (
    <div className="App">
      <header className="container-header">
        <img src="./assets/Logo.svg" />
      </header>
      <main>
        <div className="left-side flex-column">
          <button onClick={handleClickFiltro} className="open-filters-button">
            <span className="filtrar-Btn__span">
              <img src="./assets/filtro.svg" />
              Filtrar
            </span>
          </button>
{/*             Filtro          */}
          {
            filtroVisivel && (
              <div className="container-filters">
                <div className="filters__type flex-column">
                  <h1>Dia da semana</h1>
                  <div className="container-chips">
                    {
                      semana.map(diaDaSemana => {
                        return (
                          <Chip setFiltro={setFiltroDia} filtro={filtroDia} item={diaDaSemana} />
                        )
                      })
                    }
                  </div>
                </div>
                <hr class="verticalLine" size="300" />
                <div className="filters__type flex column">
                  <h1>Categoria</h1>
                  <div className="container-chips">
                    {
                      categorias.map(item => {
                        return (
                          <Chip setFiltro={setFiltroCategoria} filtro={filtroCategoria} item={item} />
                        )
                      })
                    }
                  </div>
                </div>
                <hr class="verticalLine" size="300" />
                <div className="filters__value flex column">
                  <h1>Valor</h1>
                  <form onSubmit={handleFiltroSubmit}>
                    <FilterInput
                      text="Min"
                      name="min"
                      id="min-value"
                      value={filtroMinMax.min}
                      handleChange={handleChangeFiltro}
                    />
                    <FilterInput
                      text="Max"
                      name="max"
                      id="max-value"
                      value={filtroMinMax.max}
                      handleChange={handleChangeFiltro}
                    />
                  </form>
                </div>
                <div className="filters__btn">
                  <div className="btn-container">
                    <button className="btn-clear-filters" onClick={limparFiltros}>Limpar Filtros</button>
                    <button className="btn-apply-filters" type="submit" onClick={handleFiltroSubmit} >Aplicar Filtros</button>
                  </div>
                </div>
              </div>
            )
          }
{/*             Tabela de Registros          */}
          <table className="table flex-column">
            <tr className="table-head">
              <th
                className="column-title"
                id="date"
                onClick={() => handleOrdem(ordemData, setOrdemData, setOrdemDia, setOrdemValor)}>
                Data
                {ordemData && (
                  <img src={ordemData === "crescente" ? './assets/setaUp.svg' : './assets/setaDown.svg'} />
                )}
              </th>
              <th
                className="column-title"
                id="week-day"
                onClick={() => handleOrdem(ordemDia, setOrdemDia, setOrdemData, setOrdemValor)}>
                Dia da semana
                {ordemDia && (
                  <img src={ordemDia === "crescente" ? './assets/setaUp.svg' : './assets/setaDown.svg'} />
                )}
              </th>
              <th className="column-title">Descrição</th>
              <th className="column-title">Categoria</th>
              <th
                className="column-title"
                id="value"
                onClick={() => handleOrdem(ordemValor, setOrdemValor, setOrdemData, setOrdemDia)}>
                Valor
                {ordemValor && (
                  <img src={ordemValor === "crescente" ? './assets/setaUp.svg' : './assets/setaDown.svg'} />
                )}
              </th>
              <td className="tabela__header_placeholder"><img src="./assets/editar.svg" /><img src="./assets/excluir.svg" /></td>
            </tr>
            <div className="table-body">
              {
                registros.map(registro => {
                  return (
                    <Registro
                      date={registro.date}
                      week_day={registro.week_day}
                      description={registro.description}
                      category={registro.category}
                      value={registro.value}
                      type={registro.type}
                      id={registro.id}
                      registro={registro}
                      editarRegistro={editarRegistro}
                      excluirRegistro={excluirRegistro}
                      setDeletar={setDeletar}
                      setRegistros={setRegistros}
                      deletar={deletar}
                    />
                  )
                })
              }
            </div>
          </table>
        </div>
        <div className="right-side">
{/*             Resumo          */}
          <div className="container-resume">
            <h1>Resumo</h1>
            <div>
              <span className="resumo__entrada-saida">Entradas<b className="in">{(entrada / 100).toLocaleString("pt-BR", {
                style: 'currency',
                currency: 'BRL'
              })}</b></span>

            </div>
            <div>
              <span className="resumo__entrada-saida">Saída<b className="out">{(saida / 100).toLocaleString("pt-BR", {
                style: 'currency',
                currency: 'BRL'
              })}</b></span>

            </div>
            <hr className="right-side__hr" />
            <div>
              <span className="saldo">Saldo<b className="balance">{(saldo / 100).toLocaleString("pt-BR", {
                style: 'currency',
                currency: 'BRL'
              })}</b></span>

            </div>
          </div>
          <button className="btn-add" onClick={() => {
            setAdicionandoRegistro(true);
            setFormulario({ valor: 0, categoria: '', data: '', descricao: '' })
          }}>Adicionar Registro</button>
        </div>
{/*             Modais          */}
        {
          adicionandoRegistro && (
            <Modal
              h1="Adicionar Registro"
              handleSubmit={handleSubmitAdicionar}
              handleCloseModal={handleCloseModal}
              tipoSaida={tipoSaida}
              setTipoSaida={setTipoSaida}
              formulario={formulario}
              handleChange={handleChange}
            />
          )
        }
        {
          editandoRegistro && (
            <Modal
              h1="Editar Registro"
              handleSubmit={handleSubmitEditar}
              handleCloseModal={handleCloseModal}
              tipoSaida={tipoSaida}
              setTipoSaida={setTipoSaida}
              formulario={formulario}
              handleChange={handleChange}
            />
          )
        }
      </main>
    </div>
  );
}

export default App;
