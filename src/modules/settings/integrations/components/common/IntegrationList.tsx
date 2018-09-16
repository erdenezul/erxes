import {
  ActionButtons,
  Button,
  Icon,
  Label,
  ModalTrigger,
  Table,
  Tip
} from 'modules/common/components';
import { __ } from 'modules/common/utils';
import { InstallCode } from 'modules/settings/integrations/components';
import { KIND_CHOICES } from 'modules/settings/integrations/constants';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { IIntegration } from '../../types';

type Props = {
  integrations: IIntegration[],
  removeIntegration: (integration: IIntegration, callback?: any) => void,
};

class IntegrationList extends Component<Props> {
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
          <Tip text={__('Edit messenger integration').toString()}>
            <Link
              to={`/settings/integrations/editMessenger/${integration._id}`}
            >
              <Button btnStyle="link" icon="edit" />
            </Link>
          </Tip>

          <ModalTrigger title="Install code" trigger={editTrigger}>
            <InstallCode integration={integration} />
          </ModalTrigger>
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
      <Tip text={__('Delete').toString()}>
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

    return (
      <Fragment>
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
      </Fragment>
    );
  }
}

export default IntegrationList;