var sessions = []

const sessionsCtrl = {

    newSession(session){
        let exist = sessions.find((obj)=>{
            return obj.id == session.id
        })

        if(exist){
           sessions = sessions.filter((obj)=>{
                return obj.id != session.id
            })
            sessions.push(session)
        }else{
            sessions.push(session)
        }
    },
   async getSession(token){
        let session = sessions.find((session)=>{
            return session.token == token
        })
        if(session){
            return session
        }else{
            throw 'not-found'
        }
        
    }

}









module.exports = sessionsCtrl
