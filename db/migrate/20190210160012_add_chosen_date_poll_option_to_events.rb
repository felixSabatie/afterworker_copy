class AddChosenDatePollOptionToEvents < ActiveRecord::Migration[5.2]
  def change
    add_reference :events, :date_poll_option, foreign_key: true, null: true
  end
end
