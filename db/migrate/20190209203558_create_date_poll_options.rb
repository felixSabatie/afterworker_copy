class CreateDatePollOptions < ActiveRecord::Migration[5.2]
  def change
    create_table :date_poll_options do |t|
      t.datetime :date
      t.references :event, foreign_key: true

      t.timestamps
    end
  end
end
