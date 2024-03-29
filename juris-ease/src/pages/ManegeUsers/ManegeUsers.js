import './ManegeUsers.css'
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { isUserAuthenticated } from '../../utils/data_base/firebase/authentication';
import { getUser, getUsers } from '../../utils/data_base/firebase/dao/userDAO';
import Header from '../../components/Header/Header';
import { FaPencilAlt } from 'react-icons/fa';
import { AiFillCaretLeft, AiFillCaretRight, AiFillStepBackward, AiFillStepForward } from "react-icons/ai";


function ManegeUsers() {

    const [user, setUser] = useState(null);
    const [formUser, setFormUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalClients, setTotalClients] = useState(0);
    const [totalLawyers, setTotalLawyers] = useState(0);

    async function buscarUsuarios() {
        try {
            const usersData = await getUsers();
            console.log("Users:", usersData);
            setUsers(usersData);
            return usersData;
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return [];
        }
    }

    async function obterEstatisticasUsuarios() {
        try {
            const usersData = await buscarUsuarios();
            const totalUsersData = usersData.length;
            const totalClientsData = usersData.filter(user => user.type === 'client').length;
            const totalLawyersData = usersData.filter(user => user.type === 'lawyer').length;
            setTotalUsers(totalUsersData);
            setTotalClients(totalClientsData);
            setTotalLawyers(totalLawyersData);
            return { totalUsers: totalUsersData, totalClients: totalClientsData, totalLawyers: totalLawyersData };

        } catch (error) {
            console.error('Erro ao obter estatísticas de usuários:', error);
            return { totalUsers: 0, totalClients: 0, totalLawyers: 0 };
        }
    }

    const handleSubmitForm = () => {
        console.log("Submit:", formUser)
    };

    const handleEdit = (userId) => {
        setFormUser(users.find(user => user.uid === userId))
    };

    const closeDrawerForm = () => {
        setFormUser(null)
    }

    const handleInputChange = (event) => {

    };
    

    useEffect(() => {
        async function fetchUser() {
            try {
                const isAuthenticated = isUserAuthenticated();

                if (isAuthenticated) {
                    const userData = await getUser(isAuthenticated);
                    setUser(userData);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUser();
        obterEstatisticasUsuarios();
    }, []);

    const navigate = useNavigate();
    const navigateTo = (link) => {
        navigate(`/${link}`);
    };

    const breakAcess = () => {
        while (!user) {
            setTimeout(500)
        }

        if (!user.permissions.manege_users) {
            alert('Usuario não tem permissão de acesso a essa página!')
            navigateTo('')
        }
    }

    // Lógica para calcular os índices do usuário atual exibido
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const isFirstPage = currentPage === 1;
    const isLastPage = indexOfLastUser >= totalUsers;

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className={`ManegeUsers`}>
            {user && (
                breakAcess()
            )}

            <Header user={user} />

            <div className='content'>
                <div className='content-manegment'>
                    <h1>Gerenciamento de Usuários</h1>

                    <div className='infos'>
                        <div className='info-usuarios'>
                            <h1>{totalUsers}</h1>
                            <p>Total de usuários</p>
                        </div>

                        <div className='linha-sep' />

                        <div className='info-advogados'>
                            <h1>{totalLawyers}</h1>
                            <p>Total de advogados</p>
                        </div>

                        <div className='linha-sep' />

                        <div className='info-clientes'>
                            <h1>{totalClients}</h1>
                            <p>Total de clientes</p>
                        </div>
                    </div>

                    <div className='users-list-content'>
                        <div className='users-table'>
                            <div className='table-header'>
                                <p>Nome</p>
                                <p>E-mail</p>
                                <p>Tipo</p>
                                <p>Situação</p>
                                <p></p>
                            </div>
                            <div className='table-body'>
                                {/* Mapeamento dos usuários */}
                                {currentUsers.map((user) => (
                                    <div className={`user-row ${user.state === 'Ativo' ? 'active' : 'inactive'}`} key={user.uid} onClick={() => handleEdit(user.uid)}>
                                        <p>{user.name}</p>
                                        <p>{user.email}</p>
                                        <p>{user.type}</p>
                                        <p>{user.state}</p>
                                        <p>
                                            <FaPencilAlt className="icon-pencil" />
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='navigation'>
                            {!isFirstPage && <AiFillStepBackward onClick={() => paginate(1)} />}
                            {!isFirstPage && <AiFillCaretLeft onClick={() => paginate(currentPage - 1)} />}
                            <p>{indexOfFirstUser + 1} - {Math.min(indexOfLastUser, totalUsers)} de {totalUsers}</p>
                            {!isLastPage && <AiFillCaretRight onClick={() => paginate(currentPage + 1)} />}
                            {!isLastPage && <AiFillStepForward onClick={() => paginate(Math.ceil(totalUsers / usersPerPage))} />}
                        </div>
                    </div>
                </div>

            </div>

            {formUser && (
                <div className='drawer-user-managment'>
                    <form>
                        <label htmlFor='name'>
                            <p>Nome:</p>
                            <input
                                type='text'
                                id='name'
                                value={formUser.name || ''}
                                onChange={handleInputChange}
                            />
                        </label>

                        <label htmlFor='email'>
                            <p>E-mail:</p>
                            <input
                                type='email'
                                id='email'
                                value={formUser.email || ''}
                                onChange={handleInputChange}
                            />
                        </label>

                        <label htmlFor='createdAt'>
                            <p>Cadastrado em:</p>
                            <input
                                type='text'
                                id='createdAt'
                                value={formUser.createdAt || ''}
                                readOnly
                            />
                        </label>

                        <label htmlFor='lastLogin'>
                            <p>Último Login:</p>
                            <input
                                type='text'
                                id='lastLogin'
                                value={formUser.lastLoginAt || ''}
                                readOnly
                            />
                        </label>

                        <label htmlFor='accountType'>
                            <p>Tipo de conta:</p>
                            <select
                                id='accountType'
                                value={formUser.type || ''}
                                onChange={handleInputChange}
                            >
                                <option value='lawyer'>Advogado</option>
                                <option value='client'>Cliente</option>
                            </select>
                        </label>

                        {formUser.type === 'lawyer' && (
                            <label htmlFor='oabNumber'>
                                <p>Número OAB:</p>
                                <input
                                    type='text'
                                    id='oabNumber'
                                    value={formUser.oab || ''}
                                    onChange={handleInputChange}
                                />
                            </label>
                        )}
                        <label htmlFor='phone'>
                            <p>Telefone:</p>
                            <input
                                type='text'
                                id='phone'
                                value={formUser.phoneNumber || ''}
                                onChange={handleInputChange}
                            />
                        </label>

                        <label> <p>Endereço</p> </label>
                        <div className="address-fields">
                            <label htmlFor='cep'>
                                <p>CEP:</p>
                                <input
                                    type='text'
                                    id='cep'
                                    placeholder='CEP'
                                    value={formUser.address?.cep || ''}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='state'>
                                <p>Estado:</p>
                                <input
                                    type='text'
                                    id='state'
                                    placeholder='Estado'
                                    value={formUser.address?.state || ''}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='city'>
                                <p>Cidade:</p>
                                <input
                                    type='text'
                                    id='city'
                                    placeholder='Cidade'
                                    value={formUser.address?.city || ''}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='street'>
                                <p>Rua:</p>
                                <input
                                    type='text'
                                    id='street'
                                    placeholder='Rua'
                                    value={formUser.address?.street || ''}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='number'>
                                <p>Número:</p>
                                <input
                                    type='text'
                                    id='number'
                                    placeholder='Número'
                                    value={formUser.address?.number || ''}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>

                        <label> <p>Permissões</p> </label>
                        <div className="permissions-fields">
                            <label htmlFor='headlinePermission'>
                                <p>Manchetes:</p>
                                <input
                                    type='checkbox'
                                    id='headlinePermission'
                                    checked={formUser.permissions?.headlines || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='servicesPermission'>
                                <p>Serviços:</p>
                                <input
                                    type='checkbox'
                                    id='servicesPermission'
                                    checked={formUser.permissions?.services || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='templatesPermission'>
                                <p>Templates:</p>
                                <input
                                    type='checkbox'
                                    id='templatesPermission'
                                    checked={formUser.permissions?.templates || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='documentGeneratorPermission'>
                                <p>Gerador de Documentos</p>
                                <input
                                    type='checkbox'
                                    id='documentGeneratorPermission'
                                    checked={formUser.permissions?.document_generation || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='userManagerPermission'>
                                <p>Gerenciador de Usuários:</p>
                                <input
                                    type='checkbox'
                                    id='userManagerPermission'
                                    checked={formUser.permissions?.manege_users || false}
                                    onChange={handleInputChange}
                                />
                            </label>

                            <label htmlFor='adminPermission'>
                                <p>Administrador:</p>
                                <input
                                    type='checkbox'
                                    id='adminPermission'
                                    checked={formUser.acessAdmin || false}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </div>

                        <label htmlFor='expirationDate'>
                            <p>Data de expiração:</p>
                            <input
                                type='date'
                                id='expirationDate'
                                value={formUser.expirationDate || ''}
                                onChange={handleInputChange}
                            />
                        </label>

                        <div className='bts-actions'>
                            <button className='bt-cancel' onClick={closeDrawerForm}>
                                Cancelar
                            </button>

                            <button className='bt-apply' onClick={handleSubmitForm}>
                                Aplicar
                            </button>
                        </div>

                    </form>
                </div>
            )}

        </div>
    );
}

export default ManegeUsers;