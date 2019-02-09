class CreateEvents < ActiveRecord::Migration[5.2]
  def change
    create_table :events do |t|
      t.string :name
      t.boolean :is_open_to_dates
      t.boolean :is_open_to_places
      t.string :hash
      t.boolean :has_date_poll
      t.boolean :has_place_poll
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
