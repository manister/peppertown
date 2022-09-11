import Emoji from '~/components/global/Emoji'

const Logo = (): JSX.Element => (
  <div className="text-3xl text-red-300 font-display font-bold tracking-wider">
    <span className="text-2xl mr-2">
      <Emoji src="🌶️" />
    </span>
    PepperTown
  </div>
)

export default Logo
