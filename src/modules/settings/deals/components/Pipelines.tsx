import { Button, EmptyState, SortableList } from 'modules/common/components';
import { __ } from 'modules/common/utils';
import { collectOrders } from 'modules/deals/utils';
import { Wrapper } from 'modules/layout/components';
import * as React from 'react';
import { PipelineForm } from '../containers';
import { PipelineContainer } from '../styles';
import { IPipeline, IStage } from '../types';
import { PipelineRow } from './';

type Props = {
  pipelines: IPipeline[];
  save: (
    params: { doc: { name: string; boardId: string; stages: IStage[] } },
    callback: () => void,
    pipeline?: IPipeline
  ) => void;
  updateOrder?: any;
  remove: (_id: string) => void;
  boardId: string;
};

type State = {
  showModal: boolean;
  currentPipeline?: IPipeline;
  pipelines: IPipeline[];
};

class Pipelines extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.closeModal = this.closeModal.bind(this);
    this.onChangePipelines = this.onChangePipelines.bind(this);

    this.state = {
      showModal: false,
      currentPipeline: undefined,
      pipelines: props.pipelines
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.pipelines !== this.props.pipelines) {
      this.setState({ pipelines: nextProps.pipelines });
    }
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  addPipeline() {
    this.setState({
      showModal: true,
      currentPipeline: undefined
    });
  }

  editPipeline(pipeline) {
    this.setState({
      showModal: true,
      currentPipeline: pipeline
    });
  }

  onChangePipelines(pipelines) {
    this.setState({ pipelines });

    this.props.updateOrder(collectOrders(pipelines));
  }

  renderRows() {
    const child = pipeline => (
      <PipelineRow
        key={pipeline._id}
        pipeline={pipeline}
        edit={() => this.editPipeline(pipeline)}
        remove={this.props.remove}
      />
    );

    const { pipelines } = this.state;

    return (
      <SortableList
        fields={pipelines}
        child={child}
        onChangeFields={this.onChangePipelines}
      />
    );
  }

  renderContent() {
    const { pipelines } = this.props;

    if (pipelines.length === 0) {
      return (
        <EmptyState
          size="full"
          text="There is no pipeline"
          image="/images/robots/robot-05.svg"
        />
      );
    }

    return (
      <PipelineContainer>
        <h3>{__('Pipeline')}</h3>
        {this.renderRows()}
      </PipelineContainer>
    );
  }

  renderButton() {
    if (!this.props.boardId) {
      return null;
    }

    return (
      <Button
        btnStyle="success"
        size="small"
        icon="add"
        onClick={() => this.addPipeline()}
      >
        Add pipeline
      </Button>
    );
  }

  render() {
    const { boardId, save } = this.props;
    const { currentPipeline, showModal } = this.state;

    return (
      <React.Fragment>
        <Wrapper.ActionBar right={this.renderButton()} />
        {this.renderContent()}

        <PipelineForm
          boardId={boardId}
          save={save}
          pipeline={currentPipeline}
          show={showModal}
          closeModal={this.closeModal}
        />
      </React.Fragment>
    );
  }
}

export default Pipelines;
