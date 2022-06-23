exports.getCAT = function(connections){
    let temp = [];
    connections.forEach(element => {
        if (!temp.includes(element.topic)){
            temp.push(element.topic);
        }  
    });

    return temp;
}