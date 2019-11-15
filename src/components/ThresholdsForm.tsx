import React, { PureComponent, ChangeEventHandler } from 'react';
import { FormField, Select } from '@grafana/ui';
import { FORM_ELEMENT_WIDTH, LABEL_WIDTH } from '../consts';
import { SelectableValue } from '@grafana/data';
import { getColorsOptions } from '../utils';

type ColorsOptions = SelectableValue<string>[];

interface Props {
  thresholds?: number[];
  colors?: string[];
  onChange: (data: { thresholds: number[]; colors: string[] }) => void;
}

export default class ThresholdsForm extends PureComponent<Props> {
  private colors!: ColorsOptions;

  constructor(props, ctx) {
    super(props, ctx);

    this.colors = getColorsOptions();
  }

  private handleThresholdChange: ChangeEventHandler = (e: React.SyntheticEvent) => {
    // @ts-ignore
    const value = e.target.value;

    const splitted = value.split(',');
    const thresholds = [] as number[];

    for (let i = 0; i < splitted.length; i++) {
      let num = parseInt(splitted[i].trim(), 10);

      if (Number.isNaN(num)) { num = 0; }

      thresholds.push(num);
    }

    this.props.onChange({
      colors: this.props.colors || [],
      thresholds,
    });
  }

  private handleColorsChange = (item: SelectableValue<string>[]) => {
    const colors = item.map(({ value }) => value as string);

    this.props.onChange({
      colors,
      thresholds: this.props.thresholds || [],
    });
  }

  public render() {
    const { thresholds = [], colors = [] } = this.props;

    return (
      <div className="gr-form-inline">
        <div className="gf-form">
          <FormField
            label="Colors"
            labelWidth={LABEL_WIDTH}
            inputEl={
              // @ts-ignore
              <Select<string>
                placeholder="Select or type: red, #00f"
                isClearable
                isSearchable
                isMulti
                allowCustomValue
                width={FORM_ELEMENT_WIDTH}
                // @ts-ignore
                onChange={this.handleColorsChange}
                value={colors.map(value => ({value, label: value}))}
                options={this.colors}
              />
            }
          />
        </div>
        <div className="gf-form">
          <FormField
            label="Thresholds"
            placeholder="50, 80, 120"
            labelWidth={LABEL_WIDTH}
            inputWidth={FORM_ELEMENT_WIDTH}
            type="text"
            onChange={this.handleThresholdChange}
            value={thresholds.join(', ')}
          />
        </div>
      </div>
    );
  }
}