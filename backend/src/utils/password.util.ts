export default function gerarSenhaAleatoria(tamanho: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

    let senha = '';

    for (let i = 0; i < tamanho; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        senha += chars[randomIndex];
    }

    return senha;
}