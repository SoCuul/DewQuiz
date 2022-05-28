//Vue Toasts
let vueToast
function showToast (message, type, duration) {
    return vueToast.open({
        message: message,
        type: type,
        duration: duration || 3500,
        pauseOnHover: true
    })
}

const mainVue = Vue.createApp({
    data() {
        return {
            points: 0,
            lostGame: false,
            questions: [],

            currentQuestion: {},
            pendingSubmit: false
        }
    },
    async mounted() {
        this.$nextTick(async () => {
            //Initiate toast
            vueToast = this.$toast

            //Fetch questions
            try {
                const res = await fetch('./data.json')
                const data = await res.json()

                if (data.length) this.questions = data
                else return showToast('Could not fetch questions.', 'error')
            }
            catch (error) {
                console.log(error)
                return showToast('Could not fetch questions.', 'error')
            }

            //Generate question
            this.newQuestion()
        })
    },
    methods: {
        async newQuestion () {
            //Get random question
            this.currentQuestion = this.questions[Math.floor(Math.random() * this.questions.length)]
        },
        async submitAnswer (value) {
            //Check if pending submit
            if (this.pendingSubmit) return showToast('Please wait for your answer to submit.', 'error')

            try {
                this.pendingSubmit = true

                //Check if invalid answer
                if (this.currentQuestion?.correctAnswer !== value) {
                    //Update variables
                    this.lostGame = true
                    this.pendingSubmit = false

                    //Notify user
                    return showToast(`You lost the game! | Correct Answer: "${this.currentQuestion?.correctAnswer}"`, 'error', 7000)
                }

                //Correct answer

                //Update variables
                this.points += 50
                this.currentQuestion = {}
                this.pendingSubmit = false

                //Update title
                document.title = `Dew Quiz • ${this.points} Points`

                //Notify user
                showToast('Correct answer!', 'info', 1500)

                //Generate question
                return this.newQuestion()
            }
            catch (error) {
                console.log(error)
                return showToast('There was an error.', 'error')
            }
        },
        async restartGame () {
            //Update variables
            this.points = 0
            this.currentQuestion = {}
            this.lostGame = false

            //Update title
            document.title = `Dew Quiz • ${this.points} Points`

            //Notify user
            showToast('Game Restarted. Good Luck!', 'info')

            //Generate question
            return this.newQuestion()
        }
    }
})

//Mount apps
const main = mainVue.mount('#main')

//Vue Modules
mainVue.use(VueToast.ToastPlugin)