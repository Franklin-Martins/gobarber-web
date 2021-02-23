import React, { useCallback, useRef } from 'react'
import { FiMail, FiUser, FiLock, FiCamera, FiArrowDownLeft } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup';
import getValidationErrors from '../../utils/GetValidationErrors'
import { Link, useHistory } from 'react-router-dom'

import api from '../../services/api'

import { useToast } from '../../hooks/toast'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Container, Content, AvatarInput } from './styles'
import { useAuth } from '../../hooks/auth';

interface ProfileFormData{
    name:string;
    email:string;
    password:string;
}

const Profile: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast()
    const history = useHistory()

    const { user } = useAuth()

    const handleSubmit = useCallback( async (data: ProfileFormData) =>{
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required('Nome é obrigatório'),
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
                password: Yup.string().min(6, 'minímo 6 digitos'),
            });

            await schema.validate(data,{
                abortEarly:false,
            })

            await api.post('/users', data)

            history.push('/')

            addToast({
                type: 'success',
                title:'Cadastrado com sucesso!',
                description: 'Você já pode fazer seu logon no GoBarber!'
            })
        } catch (err) {
            if (err instanceof Yup.ValidationError){
                const errors = getValidationErrors(err)
    
                formRef.current?.setErrors(errors);

                return
            }
            addToast({
                type: 'error',
                title: 'Erro ao cadastrar',
                description: 'Ocorreu um erro ao fazer o cadastro, tente novamente.'
            })
        }
    },[addToast, history])

    return (
        <Container>
            <header>
                <div>
                    <Link to='/dashboard'>
                        <FiArrowDownLeft />
                    </Link>
                </div>
            </header>
        <Content>

                <Form ref={formRef} initialData={{
                    name: user.name,
                    email: user.email
                }} onSubmit={handleSubmit}>
                    <AvatarInput>
                    <img src={user.avatar_url} alt={user.name}/>
                    <button type="button" >
                        <FiCamera />
                    </button>
                    </AvatarInput>
                    <h1>Meu perfil</h1>

                    <Input name="name" icon={FiUser} placeholder="Nome"/>
                    <Input name="email" icon={FiMail} placeholder="E-mail"/>
                    <Input containerStyle={{ marginTop:24}} name="old_password" icon={FiLock} type="password" placeholder="Senha Atual" />
                    <Input name="password" icon={FiLock} type="password" placeholder="Nova senha" />
                    <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar senha" />

                    <Button type="submit" >Confirmar mudanças</Button>

                </Form>
        </Content>
        
    </Container>
    )
}

export default Profile