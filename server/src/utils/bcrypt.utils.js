import bcrypt from "bcryptjs"

//orginal pw ma convert garna namilos vanera ,#
export const hashPassword = async(password) =>{
    try {
        const salt = await bcrypt.genSalt(10)
        return await bcrypt.hash(password,salt)
    } catch (error) {
        throw new Error('Bcrypt Error')
    }
}

//compare password
export const comparePW =async (password,hash)=>{
    try {
        return await bcrypt.compare(password,hash)
    } catch (error) {
        throw new Error('Bcrypt error')
    }
} 