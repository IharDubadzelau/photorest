function getIndex(list, id) {
    for (var i = 0; i < list.length; i++ ) {
        if (list[i].id === id) {
            return i;
        }
    }
    return -1;
}

var messageApi = Vue.resource('/message{/id}');

Vue.component('message-form', {
    props: ['messages', 'messageAttr'],
    data: function() {
        return {
            text: '',
            id: ''
        }
    },
    watch: {
        messageAttr: function(newVal, oldVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
            '<input type="text" placeholder="Write something" v-model="text" />' +
            '<input type="button" value="Save" @click="save" />' +
        '</div>',
    methods: {
        save: function() {
            var message = { text: this.text };
            var that = this;

            if (this.id) {
                messageApi.update({id: this.id}, message).then(
                    function (result) {
                        result.json().then(
                            function (data) {
                                var index = getIndex(that.messages, data.id);
                                that.messages.splice(index, 1, data);
                                that.id = '';
                            }
                        )
                    }
                )
            } else {
                messageApi.save({}, message).then(
                function (result) {
                        result.json().then(
                            function (data) {
                                that.messages.push(data);
                            }
                        )
                    }
                );
            }
            that.text = '';
        }
    }
});

Vue.component('message-row', {
    props: ['message', 'editMethod', 'messages'],
    template:
        '<div>' +
            '<i>({{ message.id }})</i> {{ message.text }}' +
            '<span style="position: absolute; right: 0">' +
                '<input type="button" value="Edit" @click="edit" />' +
                '<input type="button" value="X" @click="del" />' +
            '</span>' +
        '</div>',
    methods: {
        edit: function() {
            this.editMethod(this.message);
        },
        del: function() {
            var that = this;
            messageApi.remove({id: this.message.id}).then(
                function (result) {
                    if (result.ok) {
                        that.messages.splice(that.messages.indexOf(that.message), 1);
                    }
                }
            );
        }
    }
});

Vue.component('messages-list', {
    props: ['messages'],
    data: function() {
        return {
            message: null
        }
    },
    template:
        '<div style="position: relative; width: 300px;">' +
            '<message-form :messages="messages" :messageAttr="message" />' +
            '<message-row v-for="message in messages" :key="message.id" :message="message" ' +
            ':editMethod="editMethod" :messages="messages" />' +
        '</div>',
    created: function() {
        var that = this;
        messageApi.get().then(
            function (result) {
                result.json().then(
                    function (data) {
                        data.forEach(
                            function (message) {
                                that.messages.push(message);
                            }
                        );
                    }
                );
            }
        );
    },
    methods: {
        editMethod: function(message) {
            this.message = message;
        }
    }
});

var app = new Vue({
    el: '#app',
    template:
        '<messages-list :messages="messages" />',
    data: {
        messages: []
    }
});