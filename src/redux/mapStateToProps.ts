import { connect } from 'react-redux' 
import { Board } from '../Board'
import GCZ from '../GCZ'
import { RootState } from './store'

const mapStateToProps = (state: RootState) => {
  return {
    GCZRearrangingData : state.GCZRearrangingData,

  }
}

export default connect(mapStateToProps)(GCZ)