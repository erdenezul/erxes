import {
  ActionButtons,
  Button,
  EmptyState,
  Icon,
  Label,
  ModalTrigger,
  Table,
  Tip
} from 'modules/common/components';
import { __ } from 'modules/common/utils';
import { InstallCode } from 'modules/settings/integrations/components';
import { KIND_CHOICES } from 'modules/settings/integrations/constants';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { IIntegration } from '../../types';

type Props = {
  integrations: IIntegration[];
  removeIntegration: (integration: IIntegration, callback?: any) => void;
};

class IntegrationList extends React.Component<Props> {
  getTypeName(integration) {
    const kind = integration.kind;

    if (kind === KIND_CHOICES.TWITTER) {
      return 'twitter';
    }

    if (kind === KIND_CHOICES.FACEBOOK) {
      return 'facebook';
    }

    if (kind === KIND_CHOICES.FORM) {
      return 'form';
    }

    if (kind === KIND_CHOICES.GMAIL) {
      return 'gmail';
    }

    return 'default';
  }

  renderMessengerActions(integration) {
    const kind = integration.kind;

    if (kind === KIND_CHOICES.MESSENGER) {
      const editTrigger = (
        <Button btnStyle="link">
          <Tip text="Install code">
            <Icon icon="copy" />
          </Tip>
        </Button>
      );

      return (
        <ActionButtons>
          <Tip text={__('Edit messenger integration')}>
            <Link
              to={`/settings/integrations/editMessenger/${integration._id}`}
            >
              <Button btnStyle="link" icon="edit" />
            </Link>
          </Tip>

          <ModalTrigger
            title="Install code"
            trigger={editTrigger}
            content={props => (
              <InstallCode {...props} integration={integration} />
            )}
          />
        </ActionButtons>
      );
    }

    return null;
  }

  renderRemoveAction(integration) {
    const { removeIntegration } = this.props;

    if (!removeIntegration) {
      return null;
    }

    return (
      <Tip text={__('Delete')}>
        <Button
          btnStyle="link"
          onClick={() => removeIntegration(integration)}
          icon="cancel-1"
        />
      </Tip>
    );
  }

  renderRow(integration) {
    const twitterData = (integration || {}).twitterData || {};

    return (
      <tr key={integration._id}>
        <td>
          {integration.name}
          {integration.kind === 'twitter' &&
            ` (${twitterData.info && twitterData.info.screen_name})`}
        </td>
        <td>
          <Label className={`label-${this.getTypeName(integration)}`}>
            {integration.kind}
          </Label>
        </td>
        <td>{integration.brand ? integration.brand.name : ''}</td>
        <td>
          <ActionButtons>
            {this.renderMessengerActions(integration)}
            {this.renderRemoveAction(integration)}
          </ActionButtons>
        </td>
      </tr>
    );
  }

  render() {
    const { integrations } = this.props;

    if (!integrations || integrations.length < 1) {
      return (
        <EmptyState
          text="There aren’t any integrations at the moment."
          image="/images/robots/robot-05.svg"
        />
      );
    }

    return (
      <React.Fragment>
        <Table>
          <thead>
            <tr>
              <th>{__('Name')}</th>
              <th>{__('Kind')}</th>
              <th>{__('Brand')}</th>
              <th>{__('Actions')}</th>
            </tr>
          </thead>
          <tbody>{integrations.map(i => this.renderRow(i))}</tbody>
        </Table>
      </React.Fragment>
    );
  }
}

export default IntegrationList;
