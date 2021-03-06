import { renderHook, act } from '@testing-library/react-hooks'
import { AuthProvider, useAuth } from '../../hooks/auth';

import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api'

const apiMock = new MockAdapter(api);

describe('Auth Hook',()=>{
    it('should be able to sig in', async ()=>{
        const apiResponse = {
            user :{
                id: 'user123',
                name: 'Joh Doe',
                email: 'johdoe@example.com'
            },
            token: 'token-123'
        };

        apiMock.onPost('sessions').reply(200, )

        const setItemSpy =jest.spyOn(Storage.prototype, 'setItem');

        const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });
        
        result.current.signIn({
            email: 'johndoe@example.com',
            password: '123456'
        });

        await waitForNextUpdate();

        expect(setItemSpy).toHaveBeenCalledWith("@GoBarber:token", apiResponse.token);
        expect(setItemSpy).toHaveBeenCalledWith("@GoBarber:user", JSON.stringify(apiResponse.user));
        expect(result.current.user.email).toEqual('johndoe@example.com')
    });
    it('should restore saved data from storage when auth inits', ()=>{
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key =>{
            switch (key){
                case "@GoBarber:token": 
                    return 'token-123';
                case "@GoBarber:user": 
                    return JSON.stringify({
                        id: 'user123',
                        name: 'Joh Doe',
                        email: 'johdoe@example.com'
                    });
                default:
                    return null;
            }
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        expect(result.current.user.email).toEqual("johdoe@example.com");
    });

    it('should be able to sign ou',async ()=>{
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key =>{
            switch (key){
                case "@GoBarber:token": 
                    return 'token-123';
                case "@GoBarber:user": 
                    return JSON.stringify({
                        id: 'user123',
                        name: 'Joh Doe',
                        email: 'johdoe@example.com'
                    });
                default:
                    return null;
            }
        });
        const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem')

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        act(()=>{
            result.current.signOut()
        });


        expect(removeItemSpy).toBeCalledTimes(2);
        expect(result.current.user).toBeUndefined();
    });
    it('should be able to update user data', async ()=>{
        const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        const user = {
            id: 'user123',
            name: 'Joh Doe',
            email: 'johdoe@example.com',
            avatar_url: '123'
        };

        act(()=>{
            result.current.updateUser(user)
        });

        expect(setItemSpy).toHaveBeenCalledWith(
            '@GoBarber:user',
            JSON.stringify(user)
        );

        expect(result.current.user).toEqual(user);
    })
})