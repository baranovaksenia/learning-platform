export const formatPrice = (price: number) => {
	return new Intl.NumberFormat('he-IL', {
		style: 'currency',
		currency: 'ILS',
	}).format(price)
}
