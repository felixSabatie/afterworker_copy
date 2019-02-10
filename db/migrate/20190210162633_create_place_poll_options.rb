class CreatePlacePollOptions < ActiveRecord::Migration[5.2]
  def change
    create_table :place_poll_options do |t|
      t.string :name
      t.decimal :latitude
      t.decimal :longitude
      t.references :event, foreign_key: true

      t.timestamps
    end
  end
end
