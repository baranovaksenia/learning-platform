const { PrismaClient } = require('@prisma/client')

const database = new PrismaClient()

async function main() {
	try {
		await database.category.createMany({
			data: [
				{ name: 'Hebrew' },
				{ name: 'English' },
				{ name: 'German' },
				{ name: 'French' },
				{ name: 'Spanish' },
				{ name: 'Italian' },
			],
		})
	} catch (error) {
		console.log('Error seeding the database categories', error)
	} finally {
		await database.$disconnect()
	}
}

main()
