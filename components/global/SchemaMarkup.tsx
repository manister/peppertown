import { Thing } from 'schema-dts'

interface Props {
  data: Thing
}

const SchemaMarkup = (props: Props): JSX.Element => {
  const { data } = props
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export default SchemaMarkup
