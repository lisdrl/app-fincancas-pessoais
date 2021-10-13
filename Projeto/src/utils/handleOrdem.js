export function handleOrdem(ordem, setOrdem, set1, set2) {
    set1(false);
    set2(false);
    console.log(ordem)
    if (ordem !== "crescente") {
        setOrdem("crescente");
    } else {
        setOrdem("decrescente");
    };
};