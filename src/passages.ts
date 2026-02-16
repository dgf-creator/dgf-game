const passages = import.meta.glob('./passages/**/*.tsx', { eager: true })

console.log(passages)

export default passages
