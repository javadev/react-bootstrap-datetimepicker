import React, { Component, PropTypes } from "react";
import moment from "moment";
import classnames from "classnames";

export default class DateTimePickerDays extends Component {
  static propTypes = {
    subtractMonth: PropTypes.func.isRequired,
    addMonth: PropTypes.func.isRequired,
    viewDate: PropTypes.object.isRequired,
    selectedDate: PropTypes.object.isRequired,
    showToday: PropTypes.bool,
    daysOfWeekDisabled: PropTypes.array,
    setSelectedDate: PropTypes.func.isRequired,
    showMonths: PropTypes.func.isRequired,
    minDate: PropTypes.object,
    maxDate: PropTypes.object
  }

  static defaultProps = {
    showToday: true
  }

  constructor(props) {
    super(props);
    // Setup moment
    moment.locale("no", {
      weekdays : ["S�¸ndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "L�¸rdag"],
      months : ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober",
        "November", "Desember"],
      monthsShort : ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"],
      weekdaysShort: ["S�¸n", "Man", "Tir", "Ons", "Tor", "Fre", "L�¸r"]
    });
  }

  renderDays = () => {
    var cells, classes, days, html, month, nextMonth, prevMonth, minDate, maxDate, row, year;
    year = this.props.viewDate.year();
    month = this.props.viewDate.month();
    prevMonth = this.props.viewDate.clone().subtract(1, "months");
    days = prevMonth.daysInMonth();
    prevMonth.date(days).startOf("isoWeek");
    nextMonth = moment(prevMonth).clone().add(42, "d");
    minDate = this.props.minDate ? this.props.minDate.clone().subtract(1, "days") : this.props.minDate;
    maxDate = this.props.maxDate ? this.props.maxDate.clone() : this.props.maxDate;
    html = [];
    cells = [];
    while (prevMonth.isBefore(nextMonth)) {
      classes = {
        day: true
      };
      if (prevMonth.year() < year || (prevMonth.year() === year && prevMonth.month() < month)) {
        classes.old = true;
      } else if (prevMonth.year() > year || (prevMonth.year() === year && prevMonth.month() > month)) {
        classes.new = true;
      }
      if (prevMonth.isSame(moment({
        y: this.props.selectedDate.year(),
        M: this.props.selectedDate.month(),
        d: this.props.selectedDate.date()
      }))) {
        classes.active = true;
      }
      if (this.props.showToday) {
        if (prevMonth.isSame(moment(), "day")) {
          classes.today = true;
        }
      }
      if ((minDate && prevMonth.isBefore(minDate)) || (maxDate && prevMonth.isAfter(maxDate))) {
        classes.disabled = true;
      } else if (this.props.daysOfWeekDisabled.length > 0) {
        classes.disabled = this.props.daysOfWeekDisabled.indexOf(prevMonth.day()) !== -1;
      }
      cells.push(<td className={classnames(classes)} key={prevMonth.month() + "-" + prevMonth.date()} onClick={this.props.setSelectedDate}>{prevMonth.date()}</td>);
      if (prevMonth.weekday() === moment().endOf("isoWeek").weekday()) {
        row = <tr key={prevMonth.month() + "-" + prevMonth.date()}>{cells}</tr>;
        html.push(row);
        cells = [];
      }
      prevMonth.add(1, "d");
    }
    return html;
  }

  render() {
    return (
    <div className="datepicker-days" style={{display: "block"}}>
        <table className="table-condensed">
          <thead>
            <tr>
              <th className="prev" onClick={this.props.subtractMonth}><span className="glyphicon glyphicon-chevron-left" /></th>

              <th className="switch" colSpan="5">{moment.months()[this.props.viewDate.month()]} {this.props.viewDate.year()}</th>

              <th className="next" onClick={this.props.addMonth}><span className="glyphicon glyphicon-chevron-right" /></th>
            </tr>

            <tr>
              <th className="dow">M</th>

              <th className="dow">T</th>

              <th className="dow">O</th>

              <th className="dow">T</th>

              <th className="dow">F</th>

              <th className="dow">L</th>

              <th className="dow">S</th>
            </tr>
          </thead>

          <tbody>
            {this.renderDays()}
          </tbody>
        </table>
      </div>
    );
  }
}

