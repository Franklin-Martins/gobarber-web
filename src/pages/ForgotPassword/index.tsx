import React, { useCallback, useRef, useState } from 'react'
import { FiLogIn, FiMail } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'

import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../utils/GetValidationErrors'

import logoImg from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import { Container, Content, Background, AnimationContainer } from './styles'
import api from '../../services/api'

interface ForgotPasswordFormData{
    email: string;
}

const ForgotPassword: React.FC = ()=> {
    const [loading, setLoading ] = useState(false)
    const formRef = useRef<FormHandles>(null);

    const { addToast } = useToast()

    const handleSubmit = useCallback( async (data: ForgotPasswordFormData) =>{
        try {
            setLoading(true);

            const schema = Yup.object().shape({
                email: Yup.string().required('E-mail obrigatório').email('Digite um e-mail válido'),
            });

            await schema.validate(data,{
                abortEarly:false,
            })

            //recuperação de senha
            await api.post('/password/forgot', {
                email: data.email
            })
            addToast({
                type: 'success',
                title: 'E-mail de recuperação enviado',
                description: 'Enviamos um e-mail para confirmar a recuperação de senha'
            })

        } catch (err) {
            if (err instanceof Yup.ValidationError){
                const errors = getValidationErrors(err)
    
                formRef.current?.setErrors(errors);

                return
            }
            addToast({
                type: 'error',
                title: 'Erro na recuperação de senha',
                description: 'Ocorreu um erro ao '
            })
        } finally{
            setLoading(false)
        }
    },[addToast])

    return(
        <Container>
            <Content>
            <AnimationContainer>
                    <img src={logoImg} alt="GoBarber"/>

                    <Form ref={formRef} onSubmit={ handleSubmit }>
                        <h1>Recuperar Senha</h1>

                        <Input name="email" icon={FiMail} placeholder="Email"/>

                        <Button loading={loading} type="submit" >Recuperar</Button>

                    </Form>

                    <Link to="/">
                        <FiLogIn />
                        Fazer login
                    </Link>
            </AnimationContainer>
            </Content>
            <Background />
        </Container>
    )
}

export default ForgotPassword