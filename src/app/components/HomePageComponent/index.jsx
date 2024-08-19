'use client'

import { useEffect, useState } from 'react'

const HomePageComponent = () => {
	const [allData, setAllData] = useState([])
	const [loading, setLoading] = useState(true)
	const [showModal, setShowModal] = useState(false)
	const [modalType, setModalType] = useState('add') // 'add' or 'edit'
	const [currentIssue, setCurrentIssue] = useState({
		_id: '',
		title: '',
		description: '',
		status: 'open'
	})

	const fetchAllData = async () => {
		try {
			setLoading(true) // Start loading
			const response = await fetch('/api/get-all-data')
			if (response.ok) {
				const data = await response.json()
				setAllData(data)
			} else {
				console.error('Failed to fetch data: ', response.statusText)
				alert('Failed to fetch data!')
			}
		} catch (error) {
			console.error('Fetch error: ', error)
			alert('An error occurred while fetching data!')
		} finally {
			setLoading(false) // Stop loading
		}
	}

	const openModal = (type, issue = null) => {
		setModalType(type)
		if (type === 'edit' && issue) {
			setCurrentIssue(issue)
		} else {
			setCurrentIssue({
				_id: '',
				title: '',
				description: '',
				status: 'open'
			})
		}
		setShowModal(true)
	}

	const closeModal = () => {
		setShowModal(false)
	}

	const handleCreateOrEdit = async () => {
		const method = modalType === 'edit' ? 'PUT' : 'POST'
		const url =
			modalType === 'edit' ? '/api/update-issue' : '/api/create-issue'

		try {
			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(currentIssue)
			})

			if (response.ok) {
				alert(
					modalType === 'edit'
						? 'Issue updated successfully!'
						: 'Issue created successfully!'
				)
				closeModal()
				fetchAllData() // Re-fetch data after creation or update
			} else {
				alert(
					`Failed to ${
						modalType === 'edit' ? 'update' : 'create'
					} issue`
				)
			}
		} catch (error) {
			console.error(
				`${modalType === 'edit' ? 'Edit' : 'Create'} error: `,
				error
			)
			alert(
				`An error occurred while ${
					modalType === 'edit' ? 'updating' : 'creating'
				} the issue`
			)
		}
	}

	const handleDelete = async (_id) => {
		try {
			const response = await fetch('/api/delete-issue', {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ _id })
			})

			if (response.ok) {
				alert('Issue deleted successfully!')
				fetchAllData() // Re-fetch data after deletion
			} else {
				alert('Failed to delete issue')
			}
		} catch (error) {
			console.error('Delete error: ', error)
			alert('An error occurred while deleting the issue')
		}
	}

	useEffect(() => {
		fetchAllData()
	}, [])

	useEffect(() => {
		const seedDatabase = async () => {
			try {
				setLoading(true) // Start loading
				const response = await fetch('/api/seed-database', {
					method: 'POST'
				})

				if (response.ok) {
					alert('Dummy data inserted successfully!')
					// Re-fetch data after seeding
					fetchAllData()
				} else {
					console.error(
						'Failed to seed database: ',
						response.statusText
					)
					alert('Failed to insert dummy data!')
				}
			} catch (error) {
				console.error('Seed error: ', error)
				alert('An error occurred while seeding the database!')
			} finally {
				setLoading(false) // Stop loading after seeding
			}
		}

		if (allData.length === 0 && !loading) {
			seedDatabase()
		}
	}, [allData, loading])

	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold mb-4'>Sitemate backend challenge</h1>
			{loading ? (
				<p>Loading...</p>
			) : allData.length > 0 ? (
				<table className='min-w-full bg-white border border-gray-200'>
					<thead>
						<tr className='w-full bg-gray-100'>
							<th className='py-2 px-4 border-b text-left'>
								Actions
							</th>
							<th className='py-2 px-4 border-b text-left'>
								Title
							</th>
							<th className='py-2 px-4 border-b text-left'>
								Description
							</th>
							<th className='py-2 px-4 border-b text-left'>
								Status
							</th>
							<th className='py-2 px-4 border-b text-left'>
								Created At
							</th>
							<th className='py-2 px-4 border-b text-left'>
								Updated At
							</th>
						</tr>
					</thead>
					<tbody>
						{allData.map((item) => (
							<tr key={item._id} className='hover:bg-gray-50'>
								<td className='py-2 px-4 border-b'>
									<button
										className='mr-2 px-3 py-1 bg-blue-500 text-white rounded'
										onClick={() => openModal('edit', item)}
									>
										Edit
									</button>
									<button
										className='px-3 py-1 bg-red-500 text-white rounded'
										onClick={() => handleDelete(item._id)}
									>
										Delete
									</button>
								</td>
								<td className='py-2 px-4 border-b'>
									{item.title}
								</td>
								<td className='py-2 px-4 border-b'>
									{item.description}
								</td>
								<td className='py-2 px-4 border-b'>
									{item.status}
								</td>
								<td className='py-2 px-4 border-b'>
									{new Date(item.created_at).toLocaleString()}
								</td>
								<td className='py-2 px-4 border-b'>
									{new Date(item.updated_at).toLocaleString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No data available.</p>
			)}
			<div className='mt-4'>
				<button
					className='px-4 py-2 bg-green-500 text-white rounded'
					onClick={() => openModal('add')}
				>
					Create New Issue
				</button>
			</div>

			{showModal && (
				<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
					<div className='bg-white p-6 rounded-lg shadow-lg w-96'>
						<h2 className='text-xl font-bold mb-4'>
							{modalType === 'edit'
								? 'Edit Issue'
								: 'Create New Issue'}
						</h2>
						<div className='mb-4'>
							<label className='block text-gray-700'>Title</label>
							<input
								type='text'
								className='w-full p-2 border border-gray-300 rounded mt-1'
								value={currentIssue.title}
								onChange={(e) =>
									setCurrentIssue({
										...currentIssue,
										title: e.target.value
									})
								}
							/>
						</div>
						<div className='mb-4'>
							<label className='block text-gray-700'>
								Description
							</label>
							<textarea
								className='w-full p-2 border border-gray-300 rounded mt-1'
								value={currentIssue.description}
								onChange={(e) =>
									setCurrentIssue({
										...currentIssue,
										description: e.target.value
									})
								}
							></textarea>
						</div>
						<div className='mb-4'>
							<label className='block text-gray-700'>
								Status
							</label>
							<select
								className='w-full p-2 border border-gray-300 rounded mt-1'
								value={currentIssue.status}
								onChange={(e) =>
									setCurrentIssue({
										...currentIssue,
										status: e.target.value
									})
								}
							>
								<option value='open'>Open</option>
								<option value='in progress'>In Progress</option>
								<option value='closed'>Closed</option>
							</select>
						</div>
						<div className='flex justify-end'>
							<button
								className='px-4 py-2 bg-gray-500 text-white rounded mr-2'
								onClick={closeModal}
							>
								Cancel
							</button>
							<button
								className='px-4 py-2 bg-blue-500 text-white rounded'
								onClick={handleCreateOrEdit}
							>
								{modalType === 'edit' ? 'Update' : 'Create'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default HomePageComponent
