class CreateDatePollOptions < ActiveRecord::Migration[5.2]
  def change
    create_table :date_poll_options do |t|
      t.datetime :date
      t.references :event, foreign_key: true

      t.timestamps
    end

    create_table :date_poll_options_users, id: false do |t|
      t.belongs_to :date_poll_option, index: true
      t.belongs_to :user, index: true
    end
    add_index :date_poll_options_users, [:date_poll_option_id, :user_id], :unique => true, name: 'unique_option_voter'
  end
end
