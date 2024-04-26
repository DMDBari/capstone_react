import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUserById, editUserById, getMe } from '../lib/apiWrapper';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { UserFormDataType, UserType } from '../types';

type EditUserProps = {
    currentUser: UserType|null
}

export default function EditUser({ currentUser }: EditUserProps) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [userToEditData, setUserToEditData] = useState<UserFormDataType>({email: '', username: '', password: '', confirmPassword: ''})
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);
    
    useEffect( () => {
        async function getUser(){
            let response = await getMe(id!)
            if (response.data){
                const user = response.data
                const currentUser = JSON.parse(localStorage.getItem('currentUser')|| '{}')
                if (currentUser?.id !== user.id){
                    navigate('/')
                } else {
                    setUserToEditData({email: user.email, username: user.username, password: user.password, confirmPassword: user.confirmPassword})
                }
            } else if(response.error){
                // navigate('/')
            } else {
                navigate('/')
            }
        }

        getUser()
    }, [id, currentUser] )

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserToEditData({...userToEditData, [event.target.name]:event.target.value })
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token') || ''
        const response = await editUserById(id!, token, userToEditData);
        if (response.error){
            console.log(response.error, 'danger')
        } else {
            navigate('/')
        }
    }

    const handleDeleteClick = async () => {
        const token = localStorage.getItem('token') || '';
        const response = await deleteUserById(id!, token);
        if (response.error){
            console.log(response.error, 'danger')
        } else {
            navigate('/')
        }
    }

    const disableSubmit = !/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*\!\?\@])(?=.*[a-zA-Z]).{8,16}$/.test(userToEditData.password) || userToEditData.password !== userToEditData.confirmPassword

    return (
        <>
            <Card className='my-3'>
                <Card.Body>
                    <h3 className="text-center">Edit Post</h3>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Label>Username</Form.Label>
                        <Form.Control name='username' placeholder='Edit Username' value={userToEditData.username} onChange={handleInputChange} />
                        <Form.Label>Email</Form.Label>
                        <Form.Control name='email' placeholder='Edit Email' value={userToEditData.email} onChange={handleInputChange} />
                        <Form.Label>Password</Form.Label>
                        <Form.Control name='password' type='password' placeholder='Edit Password' value={userToEditData.password} onChange={handleInputChange} />
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control name='confirmPassword' type='password' placeholder='Confirm Password' value={userToEditData.confirmPassword} onChange={handleInputChange} />
                        <Button className='mt-3 w-50' variant='info' disabled={disableSubmit} type='submit'>Edit User</Button>
                        <Button className='mt-3 w-50' variant='danger' disabled={disableSubmit} onClick={openModal}>Delete User</Button>
                    </Form>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete {userToEditData.username}?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete {userToEditData.username}? This action cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={closeModal}>Close</Button>
                    <Button variant='danger' onClick={handleDeleteClick}>Delete User</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}