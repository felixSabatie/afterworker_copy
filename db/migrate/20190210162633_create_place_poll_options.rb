class CreatePlacePollOptions < ActiveRecord::Migration[5.2]
  def change
    create_table :place_poll_options do |t|
      t.string :name
      t.decimal :latitude, :precision => 15, :scale => 10, :default => 0.0
      t.decimal :longitude, :precision => 15, :scale => 10, :default => 0.0
      t.references :event, foreign_key: true

      t.timestamps
    end

    create_table :place_poll_options_users, id: false do |t|
      t.belongs_to :place_poll_option, index: true
      t.belongs_to :user, index: true
    end
    add_index :place_poll_options_users, [:place_poll_option_id, :user_id], :unique => true, name: 'unique_place_option_voter'
  end
end
