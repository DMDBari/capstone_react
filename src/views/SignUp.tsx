import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { CategoryType, UserFormDataType } from '../types';
import { register } from '../lib/apiWrapper';
import { useNavigate } from 'react-router-dom';


type SignUpProps = {
    flashMessage: (newMessage:string|undefined, newCategory:CategoryType|undefined) => void
}

export default function SignUp({ flashMessage }: SignUpProps) {
    const navigate = useNavigate();

    const [userFormData, setUserFormData] = useState<UserFormDataType>(
        {
            email: '',
            username: '',
            password: '',
            confirmPassword: ''
        }
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserFormData({...userFormData, [e.target.name]: e.target.value })
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let response = await register(userFormData);
        if (response.error){
            flashMessage(response.error, 'danger')
        } else {
            let newUser = response.data!
            flashMessage(`new user ${newUser.username} has been created`, 'success')
            navigate('/');
        }
    }



    const disableSubmit = !/^(?=.*\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[-\#\$\.\%\&\*\!\?\@])(?=.*[a-zA-Z]).{8,16}$/.test(userFormData.password) || userFormData.password !== userFormData.confirmPassword

    return (
        <>
            <Card className='p-2 m-2'>
                <Card.Title>Sign Up</Card.Title>
                <Card.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Label htmlFor='email'>Email</Form.Label>
                        <Form.Control id='email' name='email' type='email' placeholder='Enter Email' value={userFormData.email} onChange={handleInputChange}/>

                        <Form.Label htmlFor='username'>Username</Form.Label>
                        <Form.Control id='username' name='username' placeholder='Enter Username' value={userFormData.username} onChange={handleInputChange}/>

                        <Form.Label htmlFor='password'>Password</Form.Label>
                        <InputGroup>
                            <Form.Control id='password' name='password' type={'password'} placeholder='Enter Password' value={userFormData.password} onChange={handleInputChange}/>
                        </InputGroup>

                        <Form.Label htmlFor='confirmPassword'>Confirm Password</Form.Label>
                        <InputGroup>
                            <Form.Control id='confirmPassword' name='confirmPassword'  type={'password'} placeholder='Confirm Password' value={userFormData.confirmPassword} onChange={handleInputChange}/>
                        </InputGroup>

                        <Button type='submit' variant='outline-primary' className='w-100 mt-3' disabled={disableSubmit}>Create New User</Button>
                    </Form>
                </Card.Body>
            </Card>
        </>
    )
}