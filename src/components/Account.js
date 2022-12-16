import { Button, FormControl, FormLabel, Input, useToast, VStack } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

const Account = ({session}) => { //session is based off user's authentication status
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [firstName, setFirstName] = useState(null)
    
    const toast = useToast()

    useEffect(() => {
        getProfile()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])


const getProfile = async () => {
    try{
        setLoading(true)
        const { user } = session

        let { data, err, status } = await supabase.from('profiles')
        .select(`username, firstName`)
        .eq('id', user.id)
        .single()

        if (err && status !== 406){
            throw err
        }

        if (data) {
            setUsername(data.username)
            setFirstName(data.firstName)
        }
        console.log(data)
    } catch (err){
        toast({
            title: err,
            status: 'error',
            duration: 5000,
            isClosable: false
        })
    } finally {
        setLoading(false)
    }
}

const updateProfile = async (e) => {
    e.preventDefault()

    try{
        setLoading(true)

        const { user } = session

        const updates = {
            id: user.id,
            username,
            firstName
        }

        let { err } = await supabase.from('profiles')
        .upsert(updates)

        if (err) throw err

        toast({
            title: "Data saved!",
            status: 'success',
            duration: 5000,
            isClosable: false,
        })

    } catch(err){
        toast({
            title: err,
            status: 'error',
            duration: 5000,
            isClosable: false,
        })
    } finally{
        setLoading(false)
    }
}

return(
    <VStack>
        {loading ? ("Loading") : (
            <>
            <FormControl>
                <FormLabel>Username:</FormLabel>
                <Input type='text'
                id='username'
                value={username || ''}
                onChange={(e) => setUsername(e.target.value)}
                />
            </FormControl>
            <FormControl>
                <FormLabel>Name: {firstName}</FormLabel>
                <Input type='text'
                id='firstName'
                value={firstName || ''}
                onChange={(e) => setFirstName(e.target.value)}
                />
            </FormControl>
            <Button onClick={updateProfile} colorScheme='blue'>Update</Button>
            </>
        )}
    </VStack>
)}

export default Account
