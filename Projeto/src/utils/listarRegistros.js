export async function listarRegistros() {
    const response = await fetch('http://localhost:3333/transactions');
    const registro = await response.json();
    return registro;
};