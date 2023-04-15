import React from 'react'

const Profiles =  ({id, name, entries }) => {
  return (
        <div id="profile">
            <div className="flex" >
                <div className="item">            
                    <div className="info">
                        <h3 className='name text-dark'>{name}</h3>    
                    </div>                
                </div>
                <div className="item">
                    <span>{entries}</span>
                </div>
            </div>
        </div>
  )
}

export default Profiles;
