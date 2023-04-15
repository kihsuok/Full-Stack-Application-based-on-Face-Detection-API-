import React, {useEffect,useState} from 'react'
import Profiles from './Profiles';
import './style.css';

function Board() {

    const [users,setUsers]= useState([])
    useEffect(() => {
        fetch('http://localhost:3001/leaderboard')

        .then(res => res.json())
        .then(res=>{
            setUsers(res)
            console.log(res)
        }).catch(error=>console.log(error))
    }, [])

        
    return (
        <div className="board">
            <h1 className='leaderboard'>Leaderboard</h1>
            {users?.map((user,index)=>{
				return(
                    <Profiles 
                        key={index}
                        id={user.id} 
                        name={user.name} 
                        entries={user.entries}
                    />
				);
			})}

        </div>
    )
    
  
}

export default Board;
