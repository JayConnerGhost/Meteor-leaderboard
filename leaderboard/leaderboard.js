PlayersList = new Mongo.Collection('players');

if (Meteor.isServer) {
    Meteor.publish('thePlayers', function () { // inside the publish function
        var currentUserId = this.userId;
        return PlayersList.find({
            createdBy: currentUserId
        });

    });

}

if (Meteor.isClient) {
    // this code only runs on the client
    Meteor.subscribe('thePlayers');
    Template.leaderboard.helpers({
        // helper functions go here

        'player': function () {
            var currentUserId = Meteor.userId();
            return PlayersList.find({
                createdBy: currentUserId
            }, {
                sort: {
                    score: -1,
                    name: 1
                }
            });
        },
        'selectedClass': function () { // code goes here
            var playerId = this._id;
            var selectedPlayer = Session.get('selectedPlayer');
            if (playerId == selectedPlayer) {
                return "selected";
            }
        },
        'selectedPlayer': function () {
            var selectedPlayer = Session.get('selectedPlayer');
            return PlayersList.findOne({
                _id: selectedPlayer
            });

        },
    });
    Template.addPlayerForm.events({
        // events go here
        'submit form': function () {
            // code goes here
            event.preventDefault();
            var currentUserId = Meteor.userId();
            var playerNameVar = event.target.playerName.value;
            Meteor.call('createPlayer', playerNameVar);
        }

    });



    Template.leaderboard.events({
        'click  .player': function () {
            var playerId = this._id;
            Session.set('selectedPlayer', playerId);
        },

        'click .increment': function () { // code goes here
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('updateScore', selectedPlayer, 5);
        },

        'click .decrement': function () {
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('updateScore', selectedPlayer, -5);
        },
        'click .remove': function () { // code goes here
            var selectedPlayer = Session.get('selectedPlayer');
            Meteor.call('removePlayer', selectedPlayer);
        }
    });
}

Meteor.methods({
    // methods go here
    'updateScore': function(selectedPlayer,scoreValue){ // the code goes here
        check(selectedPlayer, String);
        check(scoreValue, Number);
        var currentUserId = Meteor.userId();
        if(currentUserId) {
            PlayersList.update({_id: selectedPlayer,  createdBy: currentUserId },
                {$inc: {score: scoreValue}});
        }
    },


    'removePlayer': function(selectedPlayer){
        check(selectedPlayer, String);
        var currentUserId = Meteor.userId();
        if(currentUserId) {
            var currentUserId = Meteor.userId();
            PlayersList.remove({_id: selectedPlayer, createdBy: currentUserId });
        }
    },


    'createPlayer': function (playerNameVar) {
        // this method's function
        check(playerNameVar, String);
        var currentUserId = Meteor.userId();
        var currentUserId = Meteor.userId();
        if (currentUserId) {

            PlayersList.insert({
                name: playerNameVar,
                score: 0,
                createdBy: currentUserId


            });
        }
    }
});