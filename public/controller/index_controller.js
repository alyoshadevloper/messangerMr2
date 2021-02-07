
app.controller('indexcontrller' , ['$scope' , 'indexFactory' , 'configFactory',   ($scope , indexFactory , configFactory) => {
    console.log('Hello Angular Index pug')
    $scope.messages = []
    $scope.pleyers= {}
    
    function scrollBottom () {
        const scrollArea = document.querySelector('.chat')
        console.log(scrollArea)
        scrollArea.scrollTop = scrollArea.scrollHeight

    }



    $scope.init = () => {
        const username = prompt('Izmingizni yozing')

        if(username){
            initSocket(username)
        }
        else{
            return false
        }
    }

   async const initSocket = (username) => {
        const option =  {
            reconncetionAttempts: 3,
            reconncetionDelay: 600
        }
        const socketUrl = await configFactory.getconfig() //// null localhost:3000
        indexFactory.connectSocket(socketUrl.data.socketUrl , option)
        .then((socket) => {
            console.log('Foydalanuvchi ulandi' )
            // console.log(username)
            socket.emit('newUser' , {username})

            /// Shariklar yaralishi
            socket.on('initPlayer' , (palyers) => {
                $scope.pleyers = palyers
                $scope.$apply() 
            })

            socket.on('newUser' , (data) => {
                // console.log(data)
                const messageData = {
                    type: {
                        code: 0,
                        message: 1
                    },
                    username: data.username
                }

                $scope.messages.push(messageData)
                $scope.pleyers[data.id] = data
                $scope.$apply()
            })


            //// Disconnect and delete ball
            socket.on('disUser' , (user) => {
                // console.log(user)
                const messageData = {
                    type: {
                        code: 0,
                        message: 0  
                    },
                    username: user.username // admin  chiqib kettdi
                }
                $scope.messages.push(messageData)
                delete $scope.pleyers[user.id]

                $scope.$apply()
            })
            socket.on('animate' , (data) => {
                console.log(data)
                $('#'+data.socketId).animate({'left' : data.x,'top' : data.y,}, () => {
                    animate = false
                })
            })


            let animate = false
            $scope.onclickplayer = ($event) => {
                console.log($event)
                if(!animate){
                    let x = $event.offsetX
                    let y = $event.offsetY
                    socket.emit('position' , {x , y})

                    $('#'+socket.id).animate({
                        'left' : x,
                        'top' : y,
    
                    }, () => {
                        animate = false
                    })
                }
            }
            ///// Sending messages
            $scope.newMessage = () => {  
                let input = $('input').val()
                // let message = $scope.message
                const messageData = {
                    type: {
                        code: 1,
                    },
                    username : username,
                    text: input
                }
                $scope.messages.push(messageData)
                // $scope.$apply()
                scrollBottom()
            }



        }).catch((err) => {
            console.log(err)
        })

      }






}])