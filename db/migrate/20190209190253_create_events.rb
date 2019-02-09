class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :name
      t.boolean :is_open_to_dates
      t.boolean :is_open_to_places
      t.string :event_hash
      t.boolean :has_date_poll
      t.boolean :has_place_poll
      t.references :user, foreign_key: true

      t.timestamps
    end
    add_index :events, :event_hash, unique: true

    create_table :events_users, id: false do |t|
      t.belongs_to :event, index: true
      t.belongs_to :user, index: true
    end
  end
end
