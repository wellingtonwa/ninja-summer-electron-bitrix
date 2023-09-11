export const requiredField = (value: string) => {
  return '' === value || null === value ? 'O campo não pode estar vazio' : null
}
